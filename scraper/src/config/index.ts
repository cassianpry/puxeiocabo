import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface Config {
  bucklerId: string;
  bucklerPraiseDate: string;
  bucklerRId: string;
  concurrency: number;
  delayMs: number;
  jitterMs: number;
  maxRetries: number;
  baseUrl: string;
  dataDir: string;
}

export function loadConfig(): Config {
  const config: Config = {
    bucklerId: process.env.BUCKLER_ID || '',
    bucklerPraiseDate: process.env.BUCKLER_PRAISE_DATE || '',
    bucklerRId: process.env.BUCKLER_R_ID || '',
    concurrency: parseInt(process.env.CONCURRENCY || '2', 10),
    delayMs: parseInt(process.env.DELAY_MS || '1000', 10),
    jitterMs: parseInt(process.env.JITTER_MS || '200', 10),
    maxRetries: parseInt(process.env.MAX_RETRIES || '5', 10),
    baseUrl: process.env.BASE_URL || 'https://www.streetfighter.com/6/buckler',
    dataDir: process.env.DATA_DIR || '../data/pages',
  };

  if (!config.bucklerId || !config.bucklerRId) {
    throw new Error('Missing required env vars: BUCKLER_ID, BUCKLER_R_ID');
  }

  return config;
}

export function getCookies(config: Config): string {
  return `buckler_id=${config.bucklerId}; buckler_praise_date=${config.bucklerPraiseDate}; buckler_r_id=${config.bucklerRId}`;
}
