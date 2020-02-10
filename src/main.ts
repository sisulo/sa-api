import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { WinstonLoggerService } from './winston-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new WinstonLoggerService('app') });
  app.enableCors(
    {
      methods: 'GET, OPTIONS, POST',
      origin: '*',
      allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
    },
  );
  await app.listen(3000);
}

bootstrap();
