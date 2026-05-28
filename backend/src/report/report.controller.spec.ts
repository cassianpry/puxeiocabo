import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ExifAnalysisService } from './exif-analysis.service';
import { SupabaseService } from '../supabase/supabase.service';

describe('ReportController', () => {
  let controller: ReportController;
  let reportService: jest.Mocked<ReportService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        {
          provide: ReportService,
          useValue: { updateStatus: jest.fn() },
        },
        {
          provide: ExifAnalysisService,
          useValue: { analyze: jest.fn() },
        },
        {
          provide: SupabaseService,
          useValue: { uploadFile: jest.fn(), deleteFile: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get(ReportController);
    reportService = module.get(ReportService);
  });

  it('rejects moderation without admin comment', async () => {
    await expect(
      controller.updateStatus('5', { status: 'rejected', adminComment: '' }),
    ).rejects.toThrow(
      new BadRequestException('Comentário do admin é obrigatório ao rejeitar uma denúncia'),
    );
    expect(reportService.updateStatus).not.toHaveBeenCalled();
  });

  it('allows approval without admin comment', async () => {
    const mockReport: Awaited<ReturnType<ReportService['updateStatus']>> = {
      id: 5,
      status: 'approved',
      adminComment: null,
    } as unknown as Awaited<ReturnType<ReportService['updateStatus']>>;

    reportService.updateStatus.mockResolvedValue(mockReport);

    await expect(
      controller.updateStatus('5', { status: 'approved', adminComment: '' }),
    ).resolves.toEqual({
      id: 5,
      status: 'approved',
      adminComment: null,
    });

    expect(reportService.updateStatus).toHaveBeenCalledWith(5, 'approved', undefined);
  });
});
