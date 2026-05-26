import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FighterModule } from './fighter/fighter.module';
import { ReportModule } from './report/report.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, FighterModule, ReportModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
