import { Module, Global } from '@nestjs/common';
import { EmailJsService } from './emailjs.service';

@Global()
@Module({
  providers: [EmailJsService],
  exports: [EmailJsService],
})
export class EmailJsModule {}
