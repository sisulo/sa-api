import { CollectorFactory } from '../collector-factory.interface';
import { Injectable, Scope } from '@nestjs/common';
import { MetricResponseDto } from '../../dto/metric-response.dto';
import { MetricRequestDto } from '../../dto/metric-request.dto';
import { PoolMetricResponseTransformer } from '../../transformers/pool-metric-response.transformer';
import { PoolMetricService } from '../../services/pool-metric.service';
import { PoolMetricEntity } from '../../entities/pool-metric.entity';

@Injectable({ scope: Scope.DEFAULT })
export class PoolCollectorFactoryImpl implements CollectorFactory<PoolMetricEntity> {
  constructor(private transformer: PoolMetricResponseTransformer,
              private service: PoolMetricService) {
  }

  async collectMetric(childComponentName: string, parentComponentName: string, request: MetricRequestDto): Promise<PoolMetricEntity> {
    return await this.service.createOrUpdateMetric(childComponentName, parentComponentName, request);
  }

  transform(input: any): MetricResponseDto {
    return this.transformer.transform(input as PoolMetricEntity);
  }

}
