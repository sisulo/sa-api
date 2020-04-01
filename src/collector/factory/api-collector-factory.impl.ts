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
import { LatencyMetricTransformer } from '../transformers/latency-metric.transformer';
import { MetricTransformer } from '../transformers/metric.transformer';

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

  getTransformer(type: CollectorType): any {
    if (type === CollectorType.LATENCY) {
      return LatencyMetricTransformer;
    }
    return MetricTransformer;
  }

}
