import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.retryConnect();
  }

  private async retryConnect(retries = 3): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await this.$connect();
        this.logger.log('Connected to database');
        return;
      } catch (err) {
        const isLast = i === retries - 1;
        this.logger.warn(
          `Database connection attempt ${i + 1}/${retries} failed: ${(err as Error).message}${isLast ? '' : ', retrying...'}`,
        );
        if (isLast) throw err;
        await new Promise(r => setTimeout(r, 2000 * (i + 1)));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
