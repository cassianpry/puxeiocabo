import { Controller, Post, Get, Patch, Body, Param, Query, ParseIntPipe, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ContactService } from './contact.service';
import { BugReportDto, ContactDto } from './dto';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post('bug-report')
  @ApiOperation({ summary: 'Submit a bug report' })
  @ApiResponse({ status: 201, description: 'Bug report submitted successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async submitBugReport(@Body() body: BugReportDto) {
    if (!body.subject || !body.description) {
      throw new BadRequestException('Assunto e descrição são obrigatórios');
    }
    if (body.subject.length < 1 || body.description.length < 1) {
      throw new BadRequestException('Assunto e descrição devem ter pelo menos 1 caractere');
    }
    await this.contactService.submitBugReport(body.subject, body.description);
    return { message: 'Bug report enviado com sucesso' };
  }

  @Post('send')
  @ApiOperation({ summary: 'Submit a contact inquiry' })
  @ApiResponse({ status: 201, description: 'Contact inquiry submitted' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async submitContact(@Body() body: ContactDto) {
    if (!body.name || !body.email || !body.subject || !body.message) {
      throw new BadRequestException('Todos os campos são obrigatórios');
    }
    await this.contactService.submitContact(body.name, body.email, body.subject, body.message);
    return { message: 'Mensagem enviada com sucesso' };
  }

  @Get('inquiries')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'List all contact inquiries (admin only)' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'List of contact inquiries' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getInquiries() {
    return this.contactService.getInquiries();
  }

  @Get('bug-reports')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'List bug reports with pagination (admin only)' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Paginated list of bug reports' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getBugReports(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.contactService.getBugReports(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
      status,
    );
  }

  @Patch('bug-reports/:id/resolve')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Mark a bug report as resolved (admin only)' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Bug report resolved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async resolveBugReport(@Param('id', ParseIntPipe) id: number) {
    await this.contactService.resolveBugReport(id);
    return { message: 'Bug report marcado como resolvido' };
  }
}
