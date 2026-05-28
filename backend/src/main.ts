import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { join } from 'path';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  if (process.env.NODE_ENV === 'production') {
    const frontendDist = join(process.cwd(), 'frontend', 'dist');
    app.useStaticAssets(frontendDist);

    const { readFileSync } = await import('fs');
    const indexHtml = readFileSync(join(frontendDist, 'index.html'), 'utf-8');

    app.use((req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/.well-known')) {
        return next();
      }
      res.type('html').send(indexHtml);
    });
  }

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

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server running on http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Swagger UI available at http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
