import { CollectorGeneric } from './collector-generic';
import { Injectable, Scope } from '@nestjs/common';
import { ChaMetricService } from '../../services/cha-metric.service';
import { ChaMetricEntity } from '../../entities/cha-metric.entity';
import { SystemEntity } from '../../entities/system.entity';
import { ChaEntity } from '../../entities/cha.entity';

@Injectable({ scope: Scope.DEFAULT })
export class ChaCollectorService extends CollectorGeneric<ChaMetricEntity, ChaEntity, SystemEntity, null>  {
  constructor(protected service: ChaMetricService) {
    super(service);
  }
}
