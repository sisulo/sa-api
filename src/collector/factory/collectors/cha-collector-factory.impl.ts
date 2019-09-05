import { CollectorFactory } from '../collector-factory.interface';
import { Injectable, Scope } from '@nestjs/common';
import { MetricResponseDto } from '../../dto/metric-response.dto';
import { MetricRequestDto } from '../../dto/metric-request.dto';
import { ChaMetricResponseTransformer } from '../../transformers/cha-metric-response.transformer';
import { ChaMetricService } from '../../services/cha-metric.service';
import { ChaMetricEntity } from '../../entities/cha-metric.entity';

@Injectable({ scope: Scope.DEFAULT })
export class ChaCollectorFactoryImpl implements CollectorFactory<ChaMetricEntity> {
  constructor(private transformer: ChaMetricResponseTransformer,
              private service: ChaMetricService) {
  }

  async collectMetric(childComponentName: string, parentComponentName: string, request: MetricRequestDto): Promise<ChaMetricEntity> {
    return await this.service.createOrUpdateMetric(childComponentName, parentComponentName, request);
  }

  transform(input: any): MetricResponseDto {
    return this.transformer.transform(input as ChaMetricEntity);
  }

}
