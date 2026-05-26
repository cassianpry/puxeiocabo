import fs from 'fs/promises';
import path from 'path';
import { RankingFighter } from '../models/types.js';
import { getPageFilePath, pageExists } from '../storage/index.js';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateFighterSchema(fighter: RankingFighter, page: number): string[] {
  const errors: string[] = [];

  if (!fighter.character_id) errors.push(`Page ${page}: Missing character_id`);
  if (fighter.fighter_banner_info?.personal_info?.fighter_id === undefined || fighter.fighter_banner_info?.personal_info?.fighter_id === null) errors.push(`Page ${page}: Missing fighter_id`);
  if (!fighter.fighter_banner_info?.personal_info?.short_id) errors.push(`Page ${page}: Missing short_id`);
  if (!fighter.fighter_banner_info?.personal_info?.platform_id) errors.push(`Page ${page}: Missing platform_id`);
  if (typeof fighter.league_point !== 'number') errors.push(`Page ${page}: Invalid league_point`);
  if (typeof fighter.league_rank !== 'number') errors.push(`Page ${page}: Invalid league_rank`);
  if (!fighter.character_name) errors.push(`Page ${page}: Missing character_name`);

  return errors;
}

export async function validatePage(dir: string, page: number): Promise<ValidationResult> {
  const result: ValidationResult = { valid: true, errors: [], warnings: [] };
  const filePath = getPageFilePath(dir, page);

  if (!await pageExists(dir, page)) {
    result.valid = false;
    result.errors.push(`Page ${page}: File missing`);
    return result;
  }

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const fighters: RankingFighter[] = JSON.parse(content);

    if (!Array.isArray(fighters)) {
      result.valid = false;
      result.errors.push(`Page ${page}: Data is not an array`);
      return result;
    }

    for (const fighter of fighters) {
      const errors = validateFighterSchema(fighter, page);
      result.errors.push(...errors);
    }

    if (result.errors.length > 0) {
      result.valid = false;
    }
  } catch (error) {
    result.valid = false;
    result.errors.push(`Page ${page}: Failed to parse JSON - ${(error as Error).message}`);
  }

  return result;
}

export async function validateAllPages(dir: string, totalPages: number): Promise<ValidationResult> {
  const result: ValidationResult = { valid: true, errors: [], warnings: [] };
  const seenFighters = new Set<string>();
  let totalFighters = 0;

  for (let page = 1; page <= totalPages; page++) {
    const pageResult = await validatePage(dir, page);
    result.errors.push(...pageResult.errors);

    if (pageResult.valid) {
      const content = await fs.readFile(getPageFilePath(dir, page), 'utf-8');
      const fighters: RankingFighter[] = JSON.parse(content);
      totalFighters += fighters.length;

      for (const fighter of fighters) {
        const key = `${fighter.fighter_banner_info.personal_info.short_id}-${fighter.character_id}`;
        if (seenFighters.has(key)) {
          result.warnings.push(`Page ${page}: Duplicate fighter ${key}`);
        }
        seenFighters.add(key);
      }
    }

    if (page % 1000 === 0) {
      console.log(`Validated ${page}/${totalPages} pages...`);
    }
  }

  if (result.errors.length > 0) {
    result.valid = false;
  }

  console.log(`\nValidation Summary:`);
  console.log(`  Total pages: ${totalPages}`);
  console.log(`  Total fighters: ${totalFighters}`);
  console.log(`  Unique fighters: ${seenFighters.size}`);
  console.log(`  Errors: ${result.errors.length}`);
  console.log(`  Warnings: ${result.warnings.length}`);

  return result;
}
