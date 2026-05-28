import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase;

  constructor() {
    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_KEY!;
    this.supabase = createClient(url, key);
  }

  async uploadFile(bucket: string, path: string, buffer: Buffer, contentType: string): Promise<string> {
    const { error } = await this.supabase.storage.from(bucket).upload(path, buffer, {
      contentType,
      upsert: false,
    });
    if (error) throw new Error(`Supabase upload failed: ${error.message}`);

    const { data: publicUrl } = this.supabase.storage.from(bucket).getPublicUrl(path);
    return publicUrl.publicUrl;
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage.from(bucket).remove([path]);
    if (error) throw new Error(`Supabase delete failed: ${error.message}`);
  }
}
