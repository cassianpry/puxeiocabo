import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { readFileSync } from 'fs';
import { join } from 'path';

(BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function () {
  return this.toString();
};

const API_PREFIXES = ['/api', '/auth', '/fighters', '/reports', '/contact'];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  const config = new DocumentBuilder()
    .setTitle('Puxei o Cabo API')
    .setDescription('SF6 rage-quit reporting system with EXIF-based AI detection')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('fighters', 'Fighter lookup endpoints')
    .addTag('reports', 'Report management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  if (process.env.NODE_ENV === 'production') {
    const frontendDist = join(process.cwd(), 'frontend', 'dist');
    app.useStaticAssets(frontendDist);

    const indexHtml = readFileSync(join(frontendDist, 'index.html'), 'utf-8');
    app.use((req, res, next) => {
      if (API_PREFIXES.some(p => req.path.startsWith(p))) {
        if (req.path === '/reports/new') return res.type('html').send(indexHtml);
        if (req.path.startsWith('/auth/verify-email') && req.headers.accept?.includes('text/html')) {
          return res.type('html').send(indexHtml);
        }
        if (req.path.startsWith('/reports/') && req.headers.accept?.includes('text/html')) {
          return res.type('html').send(indexHtml);
        }
        return next();
      }
      res.type('html').send(indexHtml);
    });
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api`);
}
bootstrap();
