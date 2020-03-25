import { CollectorGeneric } from './collector-generic';
import { Injectable, Scope } from '@nestjs/common';
import { PoolMetricResponseTransformer } from '../../transformers/pool-metric-response.transformer';
import { PoolMetricService } from '../../services/pool-metric.service';
import { PoolMetricEntity } from '../../entities/pool-metric.entity';
import { SystemEntity } from '../../entities/system.entity';
import { PoolEntity } from '../../entities/pool.entity';

@Injectable({ scope: Scope.DEFAULT })
export class PoolCollectorService extends CollectorGeneric<PoolMetricEntity, PoolEntity, SystemEntity, null> {
  constructor(protected transformer: PoolMetricResponseTransformer,
              protected service: PoolMetricService) {
    super(transformer, service);
  }
}
