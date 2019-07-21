import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { WinstonLoggerService } from './winston-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new WinstonLoggerService('app') });
  app.enableCors(); // TODO remove on prod
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000);
}
bootstrap();
