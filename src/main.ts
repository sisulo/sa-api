import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { WinstonLoggerService } from './winston-logger.service';
import { SaApiExceptionFilter } from './errors/filters/sa-api-exception.filter';
import { FallbackErrorFilter } from './errors/filters/fallback-exception.filter';
import { HttpExceptionFilter } from './errors/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new WinstonLoggerService('app') });
  app.enableCors(
    {
      methods: 'GET, OPTIONS, POST',
      origin: '*',
      allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
    },
  );
  app.useGlobalFilters(new FallbackErrorFilter(), new HttpExceptionFilter(), new SaApiExceptionFilter());

  await app.listen(3000);
}

bootstrap();
