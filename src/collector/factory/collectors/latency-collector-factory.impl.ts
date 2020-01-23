import { Injectable, Scope } from '@nestjs/common';
import { CollectorFactory } from '../collector-factory.interface';
import { ComponentKey } from '../../controllers/metric.controller';
import { MetricRequestDto } from '../../dto/metric-request.dto';
import { LatencyMetricResponseTransformer } from '../../transformers/latency-metric-response.transformer';
import { LatencyMetricService } from '../../services/latency-metric.service';
import { LatencyEntity } from '../../entities/latency.entity';
import { LatencyResponseDto } from '../../dto/latency-response.dto';

@Injectable({ scope: Scope.DEFAULT })
export class LatencyCollectorFactoryImpl implements CollectorFactory<LatencyEntity> {
  constructor(private transformer: LatencyMetricResponseTransformer,
              private service: LatencyMetricService) {
  }

  async collectMetric(componentKey: ComponentKey, request: MetricRequestDto): Promise<LatencyEntity> {
    return await this.service.createOrUpdateMetric(componentKey, request);
  }

  transform(input: any): LatencyResponseDto {
    return this.transformer.transform(input as LatencyEntity[]);
  }

}
