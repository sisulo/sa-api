import { CollectorFactory } from '../collector-factory.interface';
import { Injectable, Scope } from '@nestjs/common';
import { MetricResponseDto } from '../../dto/metric-response.dto';
import { MetricRequestDto } from '../../dto/metric-request.dto';
import { SystemMetricResponseTransformer } from '../../transformers/system-metric-response.transformer';
import { SystemMetricService } from '../../services/system-metric.service';
import { SystemMetricEntity } from '../../entities/system-metric.entity';
import { ComponentKey } from '../../controllers/metric.controller';

@Injectable({ scope: Scope.DEFAULT })
export class SystemCollectorFactoryImpl implements CollectorFactory<SystemMetricEntity> {
  constructor(private transformer: SystemMetricResponseTransformer,
              private service: SystemMetricService) {
  }

  async collectMetric(componentKey: ComponentKey, request: MetricRequestDto): Promise<SystemMetricEntity> {
    return await this.service.createOrUpdateMetric(componentKey, request);
  }

  transform(input: any): MetricResponseDto {
    return this.transformer.transform(input as SystemMetricEntity);
  }

}
