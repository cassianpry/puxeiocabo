import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ExifResult } from './exif-analysis.service';

export interface CreateReportDto {
  reportedId: string;
  comment: string;
}

export interface UpdateReportDto {
  comment: string;
  proofImagePath?: string;
  exifData?: string | null;
  aiSuspicious?: boolean;
  aiReason?: string | null;
  status?: string;
}

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async create(accountId: number, dto: CreateReportDto, proofImagePath: string, exifResult: ExifResult) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!account?.shortId) {
      throw new Error('Conta não vinculada a um lutador. Vincule seu shortId primeiro.');
    }

    const reporterId = account.shortId;

    const reported = await this.prisma.fighter.findUnique({
      where: { shortId: BigInt(dto.reportedId) },
    });
    if (!reported) {
      throw new Error(`Lutador denunciado com shortId ${dto.reportedId} não encontrado`);
    }

    if (reporterId === BigInt(dto.reportedId)) {
      throw new Error('Você não pode denunciar a si mesmo');
    }

    const status = exifResult.autoReject ? 'rejected' : 'pending';

    return this.prisma.report.create({
      data: {
        reporterId,
        reportedId: BigInt(dto.reportedId),
        comment: dto.comment,
        proofImagePath,
        exifData: exifResult.exifData,
        aiSuspicious: exifResult.aiSuspicious,
        aiReason: exifResult.aiReason,
        status,
      },
      include: {
        reporter: true,
        reported: true,
      },
    });
  }

  async findAll(page = 1, limit = 20) {
    const where = { status: { not: 'deleted' } };
    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: true,
          reported: true,
        },
      }),
      this.prisma.report.count({ where }),
    ]);

    return { reports, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findFlagged(page = 1, limit = 20) {
    const where = { aiSuspicious: true, status: { not: 'deleted' } };
    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: true,
          reported: true,
        },
      }),
      this.prisma.report.count({ where }),
    ]);

    return { reports, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findByUser(accountId: number, page = 1, limit = 20) {
    const account = await this.prisma.account.findUnique({ where: { id: accountId } });
    if (!account?.shortId) {
      return { reports: [], total: 0, page, limit, totalPages: 0 };
    }

    const where = { reporterId: account.shortId, status: { not: 'deleted' } };
    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: true,
          reported: true,
        },
      }),
      this.prisma.report.count({ where }),
    ]);

    return { reports, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    return this.prisma.report.findUnique({
      where: { id },
      include: {
        reporter: true,
        reported: true,
      },
    });
  }

  async updateStatus(id: number, status: string, adminComment?: string | null) {
    return this.prisma.report.update({
      where: { id },
      data: {
        status,
        adminComment: adminComment ?? null,
      },
      include: {
        reporter: true,
        reported: true,
      },
    });
  }

  async updateByUser(id: number, accountId: number, dto: UpdateReportDto) {
    const account = await this.prisma.account.findUnique({ where: { id: accountId } });
    if (!account?.shortId) {
      throw new Error('Conta não vinculada a um lutador');
    }

    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) {
      throw new Error('Denúncia não encontrada');
    }

    if (report.reporterId !== account.shortId) {
      throw new Error('Você só pode editar suas próprias denúncias');
    }

    if (report.status !== 'rejected') {
      throw new Error('Você só pode editar denúncias rejeitadas');
    }

    return this.prisma.report.update({
      where: { id },
      data: {
        comment: dto.comment,
        status: dto.status ?? 'pending',
        adminComment: null,
        ...(dto.proofImagePath && { proofImagePath: dto.proofImagePath }),
        ...(dto.exifData !== undefined && { exifData: dto.exifData }),
        ...(dto.aiSuspicious !== undefined && { aiSuspicious: dto.aiSuspicious }),
        ...(dto.aiReason !== undefined && { aiReason: dto.aiReason }),
      },
      include: {
        reporter: true,
        reported: true,
      },
    });
  }

  async softDelete(id: number) {
    return this.prisma.report.update({
      where: { id },
      data: { status: 'deleted' },
      include: {
        reporter: true,
        reported: true,
      },
    });
  }

  async getStats() {
    const [total, pending, approved, rejected, flagged] = await Promise.all([
      this.prisma.report.count({ where: { status: { not: 'deleted' } } }),
      this.prisma.report.count({ where: { status: 'pending' } }),
      this.prisma.report.count({ where: { status: 'approved' } }),
      this.prisma.report.count({ where: { status: 'rejected' } }),
      this.prisma.report.count({ where: { aiSuspicious: true, status: { not: 'deleted' } } }),
    ]);

    const fighterCount = await this.prisma.fighter.count();

    return { total, pending, approved, rejected, flagged, fighterCount };
  }
}
