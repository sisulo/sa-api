import { ApiCollectorFactory } from './api-collector-factory.interface';
import { CollectorType } from './collector-type.enum';
import { Injectable } from '@nestjs/common';
import { HostGroupCollectorService } from './collectors/host-group-collector.service';
import { CollectorGeneric } from './collectors/collector-generic';
import { PoolCollectorService } from './collectors/pool-collector.service';
import { ChaCollectorService } from './collectors/cha-collector.service';
import { SystemCollectorService } from './collectors/system-collector.service';
import { PortCollectorService } from './collectors/port-collector.service';
import { LatencyCollectorService } from './collectors/latency-collector.service';
import { SystemMetricEntity } from '../entities/system-metric.entity';
import { SystemMetricService } from '../services/system-metric.service';
import { SystemService } from '../services/system.service';
import { SystemMetricResponseTransformer } from '../transformers/system-metric-response.transformer';
import { SystemEntity } from '../entities/system.entity';
import { PortMetricEntity } from '../entities/port-metric.entity';
import { PortEntity } from '../entities/port.entity';
import { ChaEntity } from '../entities/cha.entity';
import { PortMetricService } from '../services/port-metric.service';
import { ChaMetricEntity } from '../entities/cha-metric.entity';
import { ChaMetricService } from '../services/cha-metric.service';
import { PoolMetricEntity } from '../entities/pool-metric.entity';
import { PoolEntity } from '../entities/pool.entity';
import { PoolMetricService } from '../services/pool-metric.service';
import { HostGroupMetricEntity } from '../entities/host-group-metric.entity';
import { HostGroupEntity } from '../entities/host-group.entity';
import { HostGroupMetricService } from '../services/host-group-metric.service';
import { LatencyEntity } from '../entities/latency.entity';
import { LatencyMetricService } from '../services/latency-metric.service';
import { PortMetricResponseTransformer } from '../transformers/port-metric-response.transformer';
import { PoolMetricResponseTransformer } from '../transformers/pool-metric-response.transformer';
import { LatencyMetricResponseTransformer } from '../transformers/latency-metric-response.transformer';
import { HostGroupMetricResponseTransformer } from '../transformers/host-group-metric-response.transformer';
import { ChaMetricResponseTransformer } from '../transformers/cha-metric-response.transformer';

@Injectable()
export class ApiCollectorFactoryImpl implements ApiCollectorFactory {
  constructor(
    private hostGroupCollectorFactory: HostGroupCollectorService,
    private poolCollectorFactory: PoolCollectorService,
    private chaCollectorFactory: ChaCollectorService,
    private systemCollectorFactory: SystemCollectorService,
    private portCollectorFactory: PortCollectorService,
    private latencyCollectorFactory: LatencyCollectorService,
  ) {

  }

  getCollector(type: CollectorType): CollectorGeneric<any, any, any, any> {
    switch (type) {
      case CollectorType.HOST_GROUPS:
        return this.hostGroupCollectorFactory;
      case CollectorType.POOLS:
        return this.poolCollectorFactory;
      case CollectorType.CHAS:
        return this.chaCollectorFactory;
      case CollectorType.SYSTEMS:
        return this.systemCollectorFactory;
      case CollectorType.PORTS:
        return this.portCollectorFactory;
      case CollectorType.LATENCY:
        return this.latencyCollectorFactory;
        // TODO when no collector matched then throw exception
    }
  }

}
