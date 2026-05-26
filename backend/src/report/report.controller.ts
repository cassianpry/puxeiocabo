import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ReportService } from './report.service';
import { ExifAnalysisService } from './exif-analysis.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { CreateReportDto, UpdateReportDto, ReportResponseDto, PaginatedResponseDto, UpdateReportStatusDto } from './dto';
import type { UpdateReportDto as UpdateReportDtoInternal } from './report.service';

@ApiTags('reports')
@Controller('reports')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly exifAnalysisService: ExifAnalysisService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all reports (public)' })
  @ApiResponse({ status: 200, description: 'Reports retrieved', type: PaginatedResponseDto })
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.reportService.findAll(page ? Number(page) : 1, limit ? Number(limit) : 20);
  }

  @Get('flagged')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'List AI-flagged reports (admin only)' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Flagged reports retrieved', type: PaginatedResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async findFlagged(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.reportService.findFlagged(page ? Number(page) : 1, limit ? Number(limit) : 20);
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get admin dashboard stats (admin only)' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Stats retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async getStats() {
    return this.reportService.getStats();
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'List own reports' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Own reports retrieved', type: PaginatedResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findMyReports(@Req() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.reportService.findByUser(req.user.id, page ? Number(page) : 1, limit ? Number(limit) : 20);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Submit a new report (JPEG only)' })
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['reportedId', 'comment', 'proof'],
      properties: {
        reportedId: { type: 'string', example: '123456789' },
        comment: { type: 'string', example: 'Rage quit after losing round 3' },
        proof: { type: 'string', format: 'binary', description: 'JPEG proof image (max 10MB)' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Report submitted', type: ReportResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input or non-JPEG image' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(
    FileInterceptor('proof', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `report-${uniqueSuffix}.jpg`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'image/jpeg') {
          return cb(new BadRequestException('Apenas imagens JPEG são aceitas'), false);
        }
        if (extname(file.originalname).toLowerCase() !== '.jpg' && extname(file.originalname).toLowerCase() !== '.jpeg') {
          return cb(new BadRequestException('Apenas imagens JPEG são aceitas'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async create(
    @Req() req: any,
    @Body() body: CreateReportDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Imagem de prova é obrigatória');
    }
    if (!body.reportedId || !body.comment) {
      throw new BadRequestException('ID do denunciado e comentário são obrigatórios');
    }

    const exifResult = await this.exifAnalysisService.analyze(file.path);

    try {
      const report = await this.reportService.create(req.user.id, body, `/uploads/${file.filename}`, exifResult);
      return { message: 'Report submitted successfully', report };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update own rejected report (JPEG only)' })
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['comment'],
      properties: {
        comment: { type: 'string', example: 'Updated comment with more details' },
        proof: { type: 'string', format: 'binary', description: 'New JPEG proof image (optional, max 10MB)' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Report updated', type: ReportResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input or report not rejected' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Not your report' })
  @UseInterceptors(
    FileInterceptor('proof', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `report-${uniqueSuffix}.jpg`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'image/jpeg') {
          return cb(new BadRequestException('Apenas imagens JPEG são aceitas'), false);
        }
        if (extname(file.originalname).toLowerCase() !== '.jpg' && extname(file.originalname).toLowerCase() !== '.jpeg') {
          return cb(new BadRequestException('Apenas imagens JPEG são aceitas'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdateReportDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!body.comment) {
      throw new BadRequestException('Comentário é obrigatório');
    }
    try {
      const dto: UpdateReportDtoInternal = { comment: body.comment };
      if (file) {
        const exifResult = await this.exifAnalysisService.analyze(file.path);
        dto.proofImagePath = `/uploads/${file.filename}`;
        dto.exifData = exifResult.exifData;
        dto.aiSuspicious = exifResult.aiSuspicious;
        dto.aiReason = exifResult.aiReason;
        if (exifResult.autoReject) {
          dto.status = 'rejected';
        }
      }
      return await this.reportService.updateByUser(Number(id), req.user.id, dto);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Soft delete a report (admin only)' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Report deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async softDelete(@Param('id') id: string) {
    try {
      return await this.reportService.softDelete(Number(id));
    } catch {
      throw new NotFoundException(`Denúncia ${id} não encontrada`);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single report (public)' })
  @ApiResponse({ status: 200, description: 'Report retrieved', type: ReportResponseDto })
  @ApiResponse({ status: 404, description: 'Report not found or deleted' })
  async findOne(@Param('id') id: string) {
    const report = await this.reportService.findOne(Number(id));
    if (!report || report.status === 'deleted') {
      throw new NotFoundException(`Denúncia ${id} não encontrada`);
    }
    return report;
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update report status (admin only)' })
  @ApiBearerAuth('access-token')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['status'],
      properties: {
        status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
        adminComment: { type: 'string', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Status updated', type: ReportResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid status' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async updateStatus(@Param('id') id: string, @Body() body: UpdateReportStatusDto) {
    const status = body?.status;
    const adminComment = body?.adminComment?.trim() || undefined;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      throw new BadRequestException('Status deve ser: pending, approved ou rejected');
    }

    if (status === 'rejected' && !adminComment) {
      throw new BadRequestException('Comentário do admin é obrigatório ao rejeitar uma denúncia');
    }

    try {
      return await this.reportService.updateStatus(Number(id), status, adminComment);
    } catch {
      throw new NotFoundException(`Denúncia ${id} não encontrada`);
    }
  }
}
