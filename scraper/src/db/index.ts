import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { Config } from '../config/index.js';
import { getPageFilePath, pageExists } from '../storage/index.js';
import { RankingFighter } from '../models/types.js';

const BATCH_SIZE = 500;

export async function importFighters(config: Config): Promise<void> {
  const prisma = new PrismaClient();

  try {
    const pagesDir = path.resolve(config.dataDir);
    const files = (await fs.readdir(pagesDir))
      .filter(f => f.startsWith('page_') && f.endsWith('.json'))
      .sort((a, b) => {
        const na = parseInt(a.replace('page_', '').replace('.json', ''), 10);
        const nb = parseInt(b.replace('page_', '').replace('.json', ''), 10);
        return na - nb;
      });

    if (files.length === 0) {
      console.log('No page files found. Run the scraper first.');
      return;
    }

    console.log(`Found ${files.length} page files to process`);

    const fightersMap = new Map<string, {
      shortId: bigint;
      fighterId: string | null;
      platformId: number;
      platformName: string;
      platformTool: string;
      circleName: string | null;
    }>();

    let parsed = 0;
    let skipped = 0;

    for (const file of files) {
      const filePath = path.join(pagesDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const fighters: RankingFighter[] = JSON.parse(content);

      for (const entry of fighters) {
        const pi = entry.fighter_banner_info?.personal_info;
        if (!pi?.short_id) {
          skipped++;
          continue;
        }

        const key = String(pi.short_id);
        if (!fightersMap.has(key)) {
          const mc = entry.fighter_banner_info?.main_circle;
          fightersMap.set(key, {
            shortId: BigInt(pi.short_id),
            fighterId: pi.fighter_id || null,
            platformId: pi.platform_id,
            platformName: pi.platform_name,
            platformTool: pi.platform_tool_name,
            circleName: mc?.circle_name || null,
          });
        }
      }

      parsed += fighters.length;
    }

    console.log(`Parsed ${parsed} entries, ${skipped} skipped, ${fightersMap.size} unique fighters`);

    const fighters = Array.from(fightersMap.values());
    let imported = 0;
    let updated = 0;
    let errors = 0;

    for (let i = 0; i < fighters.length; i += BATCH_SIZE) {
      const batch = fighters.slice(i, i + BATCH_SIZE);

      try {
        await prisma.$transaction(async (tx) => {
          for (const f of batch) {
            await tx.fighter.upsert({
              where: { shortId: f.shortId },
              update: {
                fighterId: f.fighterId,
                platformId: f.platformId,
                platformName: f.platformName,
                platformTool: f.platformTool,
                circleName: f.circleName,
              },
              create: {
                shortId: f.shortId,
                fighterId: f.fighterId,
                platformId: f.platformId,
                platformName: f.platformName,
                platformTool: f.platformTool,
                circleName: f.circleName,
              },
            });
          }
        });

        imported += batch.length;
      } catch (err) {
        console.error(`Batch error at offset ${i}:`, (err as Error).message);
        errors += batch.length;
      }

      if ((i + BATCH_SIZE) % 5000 === 0 || i + BATCH_SIZE >= fighters.length) {
        console.log(`Imported ${Math.min(i + BATCH_SIZE, fighters.length)}/${fighters.length} fighters...`);
      }
    }

    console.log(`\nImport complete!`);
    console.log(`  Total upserted: ${imported}`);
    console.log(`  Errors: ${errors}`);
  } finally {
    await prisma.$disconnect();
  }
}
