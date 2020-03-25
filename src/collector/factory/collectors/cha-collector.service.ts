import { CollectorGeneric } from './collector-generic';
import { Injectable, Scope } from '@nestjs/common';
import { ChaMetricResponseTransformer } from '../../transformers/cha-metric-response.transformer';
import { ChaMetricService } from '../../services/cha-metric.service';
import { ChaMetricEntity } from '../../entities/cha-metric.entity';
import { SystemEntity } from '../../entities/system.entity';
import { ChaEntity } from '../../entities/cha.entity';

@Injectable({ scope: Scope.DEFAULT })
export class ChaCollectorService extends CollectorGeneric<ChaMetricEntity, ChaEntity, SystemEntity, null>  {
  constructor(protected transformer: ChaMetricResponseTransformer,
              protected service: ChaMetricService) {
    super(transformer, service);
  }
}
