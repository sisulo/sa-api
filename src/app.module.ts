import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectorModule } from './collector/collector.module';
import { StatisticsModule } from './statistics/statistics.module';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.getDatabaseHost(),
      port: configService.getDatabasePort(),
      username: configService.getDatabaseUsername(),
      password: configService.getDatabasePassword(),
      database: configService.getDatabaseName(),
      entities: [__dirname + '/**/entities/*{.ts,.js}'],
      synchronize: configService.getSynchronize(),
      migrationsRun: true,
      migrationsTableName: 'migration_schema',
      migrations: ['dist/migration/*.js'],
      logging: false,
    } as PostgresConnectionOptions),
    inject: [ConfigService],
  }), CollectorModule, StatisticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
