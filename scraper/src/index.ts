import { Command } from 'commander';
import { loadConfig } from './config/index.js';
import { Sf6Scraper } from './scraper/index.js';
import { ensureDataDir, pageExists, savePage, addFailedPage, loadFailedPages, clearFailedPages } from './storage/index.js';
import { validateAllPages, validatePage } from './validator/index.js';
import { importFighters } from './db/index.js';
import pLimit from 'p-limit';

const program = new Command();

program
  .name('sf6-scraper')
  .description('Scrape SF6 ranking data from Buckler\'s Boot Camp')
  .version('1.0.0');

program
  .command('run')
  .description('Start or resume scraping')
  .option('-s, --start <page>', 'Start from page number', '1')
  .option('-e, --end <page>', 'End at page number (default: auto-detect)', '0')
  .action(async (opts) => {
    const config = loadConfig();
    await ensureDataDir(config.dataDir);

    const scraper = new Sf6Scraper(config);
    const startPage = parseInt(opts.start, 10);
    let endPage = parseInt(opts.end, 10);

    // Auto-detect total pages by fetching page 1
    if (endPage === 0) {
      console.log('Fetching page 1 to detect total pages...');
      const firstPage = await scraper.fetchWithRetry(1, config.maxRetries);
      // We need the full response to get total_page, so let's fetch it properly
      // For now, use the known value
      endPage = 19620;
      console.log(`Total pages: ${endPage}`);
    }

    console.log(`Scraping pages ${startPage} to ${endPage}`);
    console.log(`Concurrency: ${config.concurrency}, Delay: ${config.delayMs}ms`);

    const limit = pLimit(config.concurrency);
    let completed = 0;
    let failed = 0;
    const startTime = Date.now();

    const tasks = [];

    for (let page = startPage; page <= endPage; page++) {
      tasks.push(limit(async () => {
        try {
          const data = await scraper.fetchWithRetry(page, config.maxRetries);
          await savePage(config.dataDir, page, data);
          completed++;

          if (completed % 100 === 0) {
            const elapsed = (Date.now() - startTime) / 1000;
            const rate = completed / elapsed;
            const remaining = endPage - startPage + 1 - completed;
            const eta = remaining / rate;
            console.log(`Progress: ${completed}/${endPage} pages - ${rate.toFixed(1)} pages/s - ETA: ${Math.ceil(eta)}s`);
          }
        } catch (error) {
          failed++;
          await addFailedPage(config.dataDir, page, (error as Error).message, config.maxRetries);
          console.error(`Failed page ${page}: ${(error as Error).message}`);
        }

        // Delay with jitter between requests
        const jitter = Math.floor(Math.random() * config.jitterMs * 2) - config.jitterMs;
        await new Promise(resolve => setTimeout(resolve, config.delayMs + jitter));
      }));
    }

    await Promise.all(tasks);

    const elapsed = (Date.now() - startTime) / 1000;
    console.log(`\nScraping complete!`);
    console.log(`  Fetched: ${completed}`);
    console.log(`  Failed: ${failed}`);
    console.log(`  Time: ${Math.floor(elapsed / 60)}m ${Math.floor(elapsed % 60)}s`);
  });

program
  .command('validate')
  .description('Validate all scraped pages')
  .option('-t, --total <pages>', 'Total pages to validate', '19620')
  .action(async (opts) => {
    const config = loadConfig();
    const totalPages = parseInt(opts.total, 10);

    console.log(`Validating ${totalPages} pages...`);
    const result = await validateAllPages(config.dataDir, totalPages);

    if (result.valid) {
      console.log('\nValidation PASSED');
    } else {
      console.log('\nValidation FAILED');
      console.log('Errors:');
      result.errors.slice(0, 20).forEach(e => console.log(`  - ${e}`));
      if (result.errors.length > 20) {
        console.log(`  ... and ${result.errors.length - 20} more`);
      }
    }

    if (result.warnings.length > 0) {
      console.log('Warnings:');
      result.warnings.slice(0, 10).forEach(w => console.log(`  - ${w}`));
    }

    process.exit(result.valid ? 0 : 1);
  });

program
  .command('resume')
  .description('Retry failed pages')
  .option('--failed', 'Only retry failed pages')
  .action(async (opts) => {
    const config = loadConfig();

    if (opts.failed) {
      const failedPages = await loadFailedPages(config.dataDir);
      if (failedPages.length === 0) {
        console.log('No failed pages to retry');
        return;
      }

      console.log(`Retrying ${failedPages.length} failed pages...`);
      const scraper = new Sf6Scraper(config);
      let success = 0;

      for (const { page } of failedPages) {
        try {
          const data = await scraper.fetchWithRetry(page, config.maxRetries);
          await savePage(config.dataDir, page, data);
          success++;
          console.log(`  Page ${page}: OK`);
        } catch (error) {
          console.error(`  Page ${page}: FAILED - ${(error as Error).message}`);
        }
        await new Promise(resolve => setTimeout(resolve, config.delayMs + Math.floor(Math.random() * config.jitterMs * 2) - config.jitterMs));
      }

      console.log(`\nRetry complete: ${success}/${failedPages.length} succeeded`);

      if (success === failedPages.length) {
        await clearFailedPages(config.dataDir);
        console.log('Cleared failed pages list');
      }
    }
  });

program
  .command('import')
  .description('Import scraped pages into PostgreSQL')
  .action(async () => {
    const config = loadConfig();

    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is required');
      process.exit(1);
    }

    console.log('Importing fighters into database...');
    await importFighters(config);
  });

program.parse();
