import { BadRequestException } from '@nestjs/common';
import { ReportController } from './report.controller';

describe('ReportController', () => {
  let controller: ReportController;
  let reportService: {
    updateStatus: jest.Mock;
  };

  beforeEach(() => {
    reportService = {
      updateStatus: jest.fn(),
    };

    controller = new ReportController(reportService as any, {} as any);
  });

  it('rejects moderation without admin comment', async () => {
    await expect(
      (controller.updateStatus as any)('5', { status: 'rejected', adminComment: '' }),
    ).rejects.toThrow(
      new BadRequestException('Comentário do admin é obrigatório ao rejeitar uma denúncia'),
    );
    expect(reportService.updateStatus).not.toHaveBeenCalled();
  });

  it('allows approval without admin comment', async () => {
    reportService.updateStatus.mockResolvedValue({ id: 5, status: 'approved', adminComment: null });

    await expect(
      (controller.updateStatus as any)('5', { status: 'approved', adminComment: '' }),
    ).resolves.toEqual({
      id: 5,
      status: 'approved',
      adminComment: null,
    });

    expect(reportService.updateStatus).toHaveBeenCalledWith(5, 'approved', undefined);
  });
});
