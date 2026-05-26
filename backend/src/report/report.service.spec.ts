import { ReportService } from './report.service';

describe('ReportService moderation comments', () => {
  let service: ReportService;
  let prisma: {
    report: { update: jest.Mock; findUnique: jest.Mock };
    account: { findUnique: jest.Mock };
  };

  beforeEach(() => {
    prisma = {
      report: {
        update: jest.fn(),
        findUnique: jest.fn(),
      },
      account: {
        findUnique: jest.fn(),
      },
    };

    service = new ReportService(prisma as any);
  });

  it('persists admin comment when moderation status changes', async () => {
    prisma.report.update.mockResolvedValue({
      id: 5,
      status: 'rejected',
      adminComment: 'Imagem insuficiente para comprovar rage quit',
    });

    await service.updateStatus(5, 'rejected', 'Imagem insuficiente para comprovar rage quit');

    expect(prisma.report.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 5 },
        data: {
          status: 'rejected',
          adminComment: 'Imagem insuficiente para comprovar rage quit',
        },
      }),
    );
  });

  it('clears admin comment when a user resubmits a rejected report', async () => {
    prisma.account.findUnique.mockResolvedValue({ id: 9, shortId: 9999999n });
    prisma.report.findUnique.mockResolvedValue({ id: 5, reporterId: 9999999n, status: 'rejected' });
    prisma.report.update.mockResolvedValue({ id: 5, status: 'pending', adminComment: null });

    await service.updateByUser(5, 9, { comment: 'Nova explicação' });

    expect(prisma.report.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 5 },
        data: expect.objectContaining({
          comment: 'Nova explicação',
          adminComment: null,
        }),
      }),
    );
  });
});
