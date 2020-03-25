import { CollectorGeneric } from './collector-generic';
import { Injectable, Scope } from '@nestjs/common';
import { SystemMetricEntity } from '../../entities/system-metric.entity';
import { SystemMetricResponseTransformer } from '../../transformers/system-metric-response.transformer';
import { SystemMetricService } from '../../services/system-metric.service';
import { SystemEntity } from '../../entities/system.entity';

@Injectable({ scope: Scope.DEFAULT })
export class SystemCollectorService extends CollectorGeneric<SystemMetricEntity, SystemEntity, null, null> {
  constructor(protected transformer: SystemMetricResponseTransformer,
              protected service: SystemMetricService) {
    super(transformer, service);
  }
}

