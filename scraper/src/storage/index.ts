import fs from 'fs/promises';
import path from 'path';
import { RankingFighter } from '../models/types.js';

export interface FailedPage {
  page: number;
  error: string;
  retries: number;
}

export async function ensureDataDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

export function getPageFilePath(dir: string, page: number): string {
  return path.resolve(dir, `page_${page}.json`);
}

export async function pageExists(dir: string, page: number): Promise<boolean> {
  const filePath = getPageFilePath(dir, page);
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function savePage(dir: string, page: number, data: RankingFighter[]): Promise<void> {
  const filePath = getPageFilePath(dir, page);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function loadFailedPages(dir: string): Promise<FailedPage[]> {
  const filePath = path.resolve(dir, '../failed_pages.json');
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function saveFailedPages(dir: string, failed: FailedPage[]): Promise<void> {
  const filePath = path.resolve(dir, '../failed_pages.json');
  await fs.writeFile(filePath, JSON.stringify(failed, null, 2), 'utf-8');
}

export async function addFailedPage(dir: string, page: number, error: string, retries: number): Promise<void> {
  const failed = await loadFailedPages(dir);
  failed.push({ page, error, retries });
  await saveFailedPages(dir, failed);
}

export async function clearFailedPages(dir: string): Promise<void> {
  const filePath = path.resolve(dir, '../failed_pages.json');
  try {
    await fs.unlink(filePath);
  } catch {
    // File doesn't exist, ignore
  }
}
