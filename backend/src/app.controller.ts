import { Controller, Get, Req, Res } from '@nestjs/common';
import { join } from 'path';
import type { Request, Response } from 'express';

@Controller()
export class AppController {
  @Get('*')
  serveFrontend(@Req() req: Request, @Res() res: Response) {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'Not Found' });
    }
    res.sendFile(join(process.cwd(), 'frontend', 'dist', 'index.html'));
  }
}
