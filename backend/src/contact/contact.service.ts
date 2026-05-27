import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async submitBugReport(subject: string, description: string) {
    return this.prisma.bugReport.create({
      data: { subject, description },
    });
  }
}
