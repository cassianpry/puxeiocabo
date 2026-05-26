import { Controller, Get, Query, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FighterService } from './fighter.service';

@ApiTags('fighters')
@Controller('fighters')
export class FighterController {
  constructor(private readonly fighterService: FighterService) {}

  @Get()
  @ApiOperation({ summary: 'Search fighters by name or short_id' })
  @ApiResponse({ status: 200, description: 'Fighters found' })
  async search(@Query('q') q: string, @Query('limit') limit?: string) {
    if (!q) {
      return { error: 'Parâmetro de busca "q" é obrigatório' };
    }
    const fighters = await this.fighterService.search(q, limit ? Number(limit) : 20);
    return { count: fighters.length, fighters };
  }

  @Get(':shortId')
  @ApiOperation({ summary: 'Get fighter details by short_id' })
  @ApiResponse({ status: 200, description: 'Fighter details retrieved' })
  @ApiResponse({ status: 404, description: 'Fighter not found' })
  async findOne(@Param('shortId') shortId: string) {
    const fighter = await this.fighterService.findByShortId(shortId);
    if (!fighter) {
      throw new NotFoundException(`Lutador com shortId ${shortId} não encontrado`);
    }
    return fighter;
  }

  @Get(':shortId/reports')
  @ApiOperation({ summary: 'Get reports for a fighter' })
  @ApiResponse({ status: 200, description: 'Fighter reports retrieved' })
  @ApiResponse({ status: 404, description: 'Fighter not found' })
  async getReports(@Param('shortId') shortId: string) {
    const fighter = await this.fighterService.findByShortId(shortId);
    if (!fighter) {
      throw new NotFoundException(`Lutador com shortId ${shortId} não encontrado`);
    }
    return {
      reportsReceived: fighter.reportsReceived,
      reportsMade: fighter.reportsMade,
    };
  }
}
