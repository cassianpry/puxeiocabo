import { ApiProperty } from '@nestjs/swagger';

export class BugReportDto {
  @ApiProperty({ example: 'Botão não funciona', description: 'Subject of the bug report' })
  subject: string;

  @ApiProperty({ example: 'O botão de enviar não responde...', description: 'Detailed description' })
  description: string;
}

export class ContactDto {
  @ApiProperty({ example: 'João Silva', description: 'Sender name' })
  name: string;

  @ApiProperty({ example: 'joao@email.com', description: 'Sender email' })
  email: string;

  @ApiProperty({ example: 'Dúvida sobre denúncias', description: 'Subject' })
  subject: string;

  @ApiProperty({ example: 'Gostaria de saber mais sobre...', description: 'Message content' })
  message: string;
}
