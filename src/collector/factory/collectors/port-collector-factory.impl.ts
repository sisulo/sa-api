import { Injectable, Scope } from '@nestjs/common';
import { CollectorFactory } from '../collector-factory.interface';
import { MetricRequestDto } from '../../dto/metric-request.dto';
import { MetricResponseDto } from '../../dto/metric-response.dto';
import { PortMetricService } from '../../services/port-metric.service';
import { PortMetricEntity } from '../../entities/port-metric.entity';
import { ComponentKey } from '../../controllers/metric.controller';
import { PortMetricResponseTransformer } from '../../transformers/port-metric-response.transformer';

@Injectable({ scope: Scope.DEFAULT })
export class PortCollectorFactoryImpl implements CollectorFactory<PortMetricEntity> {
  constructor(private transformer: PortMetricResponseTransformer,
              private service: PortMetricService) {
  }

  async collectMetric(componentKey: ComponentKey, request: MetricRequestDto): Promise<PortMetricEntity> {
    return await this.service.createOrUpdateMetric(componentKey, request);
  }

  transform(input: any): MetricResponseDto {
    return this.transformer.transform(input as PortMetricEntity);
  }

}
