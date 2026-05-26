import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FighterService {
  constructor(private prisma: PrismaService) {}

  async search(query: string, limit = 20) {
    try {
      const byShortId = await this.prisma.fighter.findMany({
        where: { shortId: BigInt(query) },
        take: limit,
      });
      if (byShortId.length > 0) return byShortId;
    } catch {
    }

    return this.prisma.fighter.findMany({
      where: {
        fighterId: { contains: query },
      },
      take: limit,
    });
  }

  async findByShortId(shortId: string) {
    return this.prisma.fighter.findUnique({
      where: { shortId: BigInt(shortId) },
      include: {
        reportsReceived: {
          include: { reporter: true },
          orderBy: { createdAt: 'desc' },
        },
        reportsMade: {
          include: { reported: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async count() {
    return this.prisma.fighter.count();
  }
}
