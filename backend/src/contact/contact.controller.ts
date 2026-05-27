import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { BugReportDto } from './dto';

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
}
