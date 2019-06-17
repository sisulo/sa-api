import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectorModule } from './collector/collector.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    username: 'storageAnalyticsApi',
    password: '2r5dQtgIloo',
    database: 'storageAnalytics',
    entities: [__dirname + '/**/entities/*{.ts,.js}'],
    synchronize: true,
  }), CollectorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
