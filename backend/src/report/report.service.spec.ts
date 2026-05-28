import { ReportService } from './report.service';
import type { PrismaService } from '../prisma/prisma.service';

type MockPrisma = {
  [K in keyof PrismaService]: PrismaService[K] extends (...args: infer A) => infer R
    ? jest.Mock<R, A>
    : {
        [K2 in keyof PrismaService[K]]: jest.Mock;
      };
};

describe('ReportService moderation comments', () => {
  let service: ReportService;
  let prisma: MockPrisma & PrismaService;

  beforeEach(() => {
    prisma = {
      report: {
        update: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        count: jest.fn(),
      },
      account: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
      fighter: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
      },
      verificationToken: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      contactInquiry: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
      bugReport: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
      $transaction: jest.fn(),
    } as unknown as MockPrisma & PrismaService;

    service = new ReportService(prisma as unknown as PrismaService);
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
