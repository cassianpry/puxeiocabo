import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

const pagesDir = path.resolve(__dirname, '../../data/pages');
const BATCH_SIZE = 500;

async function importFighters() {
  const files = fs.readdirSync(pagesDir).filter(f => f.startsWith('page_') && f.endsWith('.json')).sort();
  
  console.log(`Found ${files.length} page files to process`);
  
  let imported = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  const fightersMap = new Map<number, {
    shortId: bigint;
    fighterId: string | null;
    platformId: number;
    platformName: string;
    platformTool: string;
  }>();

  // First pass: collect all unique fighters
  for (const file of files) {
    const filePath = path.join(pagesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const fighters: any[] = JSON.parse(content);
    
    for (const entry of fighters) {
      const pi = entry.fighter_banner_info?.personal_info;
      if (!pi?.short_id) {
        skipped++;
        continue;
      }
      
      if (!fightersMap.has(pi.short_id)) {
        fightersMap.set(pi.short_id, {
          shortId: BigInt(pi.short_id),
          fighterId: pi.fighter_id || null,
          platformId: pi.platform_id,
          platformName: pi.platform_name,
          platformTool: pi.platform_tool_name,
        });
      }
    }
  }

  console.log(`Collected ${fightersMap.size} unique fighters`);

  // Second pass: batch upsert
  const fighters = Array.from(fightersMap.values());
  
  for (let i = 0; i < fighters.length; i += BATCH_SIZE) {
    const batch = fighters.slice(i, i + BATCH_SIZE);
    
    try {
      await prisma.$transaction(async (tx) => {
        for (const f of batch) {
          const existing = await tx.fighter.findUnique({ where: { shortId: f.shortId } });
          if (existing) {
            await tx.fighter.update({
              where: { shortId: f.shortId },
              data: {
                fighterId: f.fighterId,
                platformId: f.platformId,
                platformName: f.platformName,
                platformTool: f.platformTool,
              },
            });
            updated++;
          } else {
            await tx.fighter.create({ data: f });
            imported++;
          }
        }
      });
    } catch (err) {
      console.error(`Batch error at offset ${i}:`, (err as Error).message);
      errors += batch.length;
    }

    if ((i + BATCH_SIZE) % 5000 === 0 || i + BATCH_SIZE >= fighters.length) {
      console.log(`Processed ${Math.min(i + BATCH_SIZE, fighters.length)}/${fighters.length} fighters... (${imported} new, ${updated} updated)`);
    }
  }

  console.log(`\nImport complete!`);
  console.log(`  Pages processed: ${files.length}`);
  console.log(`  Unique fighters: ${fightersMap.size}`);
  console.log(`  New fighters: ${imported}`);
  console.log(`  Updated fighters: ${updated}`);
  console.log(`  Skipped (no short_id): ${skipped}`);
  console.log(`  Errors: ${errors}`);
  
  await prisma.$disconnect();
}

importFighters().catch(console.error);
