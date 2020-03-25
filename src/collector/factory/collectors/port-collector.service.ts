import { Injectable, Scope } from '@nestjs/common';
import { CollectorGeneric } from './collector-generic';
import { PortMetricService } from '../../services/port-metric.service';
import { PortMetricEntity } from '../../entities/port-metric.entity';
import { PortMetricResponseTransformer } from '../../transformers/port-metric-response.transformer';
import { SystemEntity } from '../../entities/system.entity';
import { PortEntity } from '../../entities/port.entity';
import { ChaEntity } from '../../entities/cha.entity';

@Injectable({ scope: Scope.DEFAULT })
export class PortCollectorService extends CollectorGeneric<PortMetricEntity, PortEntity, ChaEntity, SystemEntity> {
  constructor(protected transformer: PortMetricResponseTransformer,
              protected service: PortMetricService) {
    super(transformer, service);
  }
}
