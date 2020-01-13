import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { WinstonLoggerService } from './winston-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new WinstonLoggerService('app') });
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  await app.listen(3000);
}

bootstrap();
