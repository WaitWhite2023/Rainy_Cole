import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { mkdirSync } from 'fs';
import { resolve } from 'path';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const uploadDir = process.env.UPLOAD_DIR || resolve(process.cwd(), 'apps/api/uploads');

  mkdirSync(uploadDir, { recursive: true });

  app.setGlobalPrefix('api');
  app.useStaticAssets(uploadDir, { prefix: '/uploads/' });
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175'
    ],
    credentials: true
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Rainy Cole API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.API_PORT || 3000);
}

bootstrap();
