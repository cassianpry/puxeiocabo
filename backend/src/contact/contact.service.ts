import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailJsService } from '../emailjs/emailjs.service';

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private emailJs: EmailJsService,
  ) {}

  async submitBugReport(subject: string, description: string) {
    return this.prisma.bugReport.create({
      data: { subject, description },
    });
  }

  async submitContact(name: string, email: string, subject: string, message: string) {
    const inquiry = await this.prisma.contactInquiry.create({
      data: { name, email, subject, message },
    });

    try {
      await this.emailJs.sendAdminContactNotification({ name, email, subject, message });
    } catch {
    }

    return inquiry;
  }

  async getInquiries() {
    return this.prisma.contactInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBugReports(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};
    const [reports, total] = await Promise.all([
      this.prisma.bugReport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.bugReport.count({ where }),
    ]);
    return { reports, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async resolveBugReport(id: number) {
    return this.prisma.bugReport.update({
      where: { id },
      data: { status: 'resolved' },
    });
  }
}
