import { Injectable, Scope } from '@nestjs/common';
import { CollectorGeneric } from './collector-generic';
import { LatencyMetricResponseTransformer } from '../../transformers/latency-metric-response.transformer';
import { LatencyMetricService } from '../../services/latency-metric.service';
import { LatencyEntity } from '../../entities/latency.entity';
import { SystemEntity } from '../../entities/system.entity';
import { PoolEntity } from '../../entities/pool.entity';

@Injectable({ scope: Scope.DEFAULT })
export class LatencyCollectorService extends CollectorGeneric<LatencyEntity, PoolEntity, SystemEntity, null>  {
  constructor(protected transformer: LatencyMetricResponseTransformer,
              protected service: LatencyMetricService) {
    super(transformer, service);
  }
}
