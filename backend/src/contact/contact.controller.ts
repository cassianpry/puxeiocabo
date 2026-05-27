import { Controller, Post, Get, Body, UseGuards, BadRequestException } from '@nestjs/common';
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
}
