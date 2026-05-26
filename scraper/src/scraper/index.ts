import axios from 'axios';
import { Config, getCookies } from '../config/index.js';
import { NextData, RankingFighter } from '../models/types.js';

export class Sf6Scraper {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async fetchPage(page: number): Promise<RankingFighter[]> {
    const url = `${this.config.baseUrl}/pt-br/ranking/league?character_filter=1&character_id=luke&platform=1&user_status=1&home_filter=2&home_category_id=4&home_id=0&league_rank=0&page=${page}`;

    const response = await axios.get(url, {
      headers: {
        'Cookie': getCookies(this.config),
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': `${this.config.baseUrl}/pt-br/ranking/league`,
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 30000,
    });

    const match = response.data.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
    if (!match) {
      throw new Error('No __NEXT_DATA__ found in response');
    }

    const nextData: NextData = JSON.parse(match[1]);
    const pageProps = nextData.props.pageProps;

    if (pageProps.common.statusCode !== 200) {
      throw new Error(`API returned status code: ${pageProps.common.statusCode}`);
    }

    return pageProps.league_point_ranking.ranking_fighter_list;
  }

  async fetchWithRetry(page: number, maxRetries: number): Promise<RankingFighter[]> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.fetchPage(page);
      } catch (error) {
        lastError = error as Error;
        const status = (error as any).response?.status;

        if (attempt < maxRetries) {
          let backoff: number;

          if (status === 405) {
            backoff = Math.min(10000 * Math.pow(3, attempt - 1), 180000);
            console.log(`  Page ${page}: 405 Forbidden, backing off ${backoff}ms (attempt ${attempt}/${maxRetries})`);
          } else if (status === 429 || status === 503) {
            backoff = Math.min(1000 * Math.pow(2, attempt - 1), 30000);
            console.log(`  Page ${page}: Rate limited (${status}), backing off ${backoff}ms (attempt ${attempt}/${maxRetries})`);
          } else {
            backoff = 1000 * attempt;
            console.log(`  Page ${page}: Error: ${(error as Error).message}, retrying in ${backoff}ms (attempt ${attempt}/${maxRetries})`);
          }

          await this.sleep(backoff);
        }
      }
    }

    throw lastError || new Error(`Failed to fetch page ${page} after ${maxRetries} retries`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
