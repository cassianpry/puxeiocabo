import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({ example: '123456789', description: 'Reported fighter short_id (BigInt as string)' })
  reportedId: string;

  @ApiProperty({ example: 'Rage quit after losing round 3', description: 'Report comment' })
  comment: string;
}

export class UpdateReportDto {
  @ApiProperty({ example: 'Updated comment with more details', description: 'Updated report comment' })
  comment: string;
}

export class ReportResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '123456789' })
  reporterId: string;

  @ApiProperty({ example: '987654321' })
  reportedId: string;

  @ApiProperty({ example: '/uploads/report-1234567890-123456.jpg' })
  proofImagePath: string;

  @ApiProperty({ example: 'Rage quit after losing round 3' })
  comment: string;

  @ApiProperty({ example: 'Imagem insuficiente para comprovar rage quit', required: false, nullable: true })
  adminComment?: string | null;

  @ApiProperty({ example: '{"Make":"Canon","Model":"EOS R5"}', required: false })
  exifData?: string;

  @ApiProperty({ example: false })
  aiSuspicious: boolean;

  @ApiProperty({ example: null, required: false })
  aiReason?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: 'pending', enum: ['pending', 'approved', 'rejected', 'deleted'] })
  status: string;
}

export class PaginatedResponseDto {
  @ApiProperty({ type: [ReportResponseDto] })
  reports: ReportResponseDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}

export class UpdateReportStatusDto {
  @ApiProperty({ example: 'rejected', enum: ['pending', 'approved', 'rejected'] })
  status: string;

  @ApiProperty({ example: 'Imagem insuficiente para comprovar rage quit', required: false, nullable: true })
  adminComment?: string | null;
}
