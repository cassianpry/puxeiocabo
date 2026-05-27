import { ApiProperty } from '@nestjs/swagger';

export class BugReportDto {
  @ApiProperty({ example: 'Botão não funciona', description: 'Subject of the bug report' })
  subject: string;

  @ApiProperty({ example: 'O botão de enviar não responde...', description: 'Detailed description' })
  description: string;
}
