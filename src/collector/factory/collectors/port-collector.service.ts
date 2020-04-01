import { Injectable, Scope } from '@nestjs/common';
import { CollectorGeneric } from './collector-generic';
import { PortMetricService } from '../../services/port-metric.service';
import { PortMetricEntity } from '../../entities/port-metric.entity';
import { SystemEntity } from '../../entities/system.entity';
import { PortEntity } from '../../entities/port.entity';
import { ChaEntity } from '../../entities/cha.entity';

@Injectable({ scope: Scope.DEFAULT })
export class PortCollectorService extends CollectorGeneric<PortMetricEntity, PortEntity, ChaEntity, SystemEntity> {
  constructor(protected service: PortMetricService) {
    super(service);
  }
}
