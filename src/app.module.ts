import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectorModule } from './collector/collector.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'storageAnalytics',
    entities: [__dirname + '/**/entities/*{.ts,.js}'],
    synchronize: false,
  }), CollectorModule, StatisticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
