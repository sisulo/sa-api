import { CollectorGeneric } from './collector-generic';
import { Injectable, Scope } from '@nestjs/common';
import { HostGroupMetricEntity } from '../../entities/host-group-metric.entity';
import { HostGroupMetricResponseTransformer } from '../../transformers/host-group-metric-response.transformer';
import { HostGroupMetricService } from '../../services/host-group-metric.service';
import { SystemEntity } from '../../entities/system.entity';
import { HostGroupEntity } from '../../entities/host-group.entity';

@Injectable({ scope: Scope.DEFAULT })
export class HostGroupCollectorService extends CollectorGeneric<HostGroupMetricEntity, HostGroupEntity, SystemEntity, null>  {
  constructor(protected transformer: HostGroupMetricResponseTransformer,
              protected service: HostGroupMetricService) {
    super(transformer, service);
  }
}
