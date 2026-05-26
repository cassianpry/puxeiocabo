import { Module } from '@nestjs/common';
import { FighterController } from './fighter.controller';
import { FighterService } from './fighter.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FighterController],
  providers: [FighterService],
})
export class FighterModule {}
