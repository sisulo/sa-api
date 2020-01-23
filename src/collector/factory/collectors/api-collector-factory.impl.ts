import { ApiCollectorFactory } from '../api-collector-factory.interface';
import { CollectorType } from '../collector-type.enum';
import { Injectable } from '@nestjs/common';
import { HostGroupCollectorFactoryImpl } from './host-group-collector-factory.impl';
import { CollectorFactory } from '../collector-factory.interface';
import { PoolCollectorFactoryImpl } from './pool-collector-factory.impl';
import { ChaCollectorFactoryImpl } from './cha-collector-factory.impl';
import { SystemCollectorFactoryImpl } from './system-collector-factory.impl';
import { PortCollectorFactoryImpl } from './port-collector-factory.impl';
import { LatencyCollectorFactoryImpl } from './latency-collector-factory.impl';

@Injectable()
export class ApiCollectorFactoryImpl implements ApiCollectorFactory {
  constructor(
    private hostGroupCollectorFactory: HostGroupCollectorFactoryImpl,
    private poolCollectorFactory: PoolCollectorFactoryImpl,
    private chaCollectorFactory: ChaCollectorFactoryImpl,
    private systemCollectorFactory: SystemCollectorFactoryImpl,
    private portCollectorFactory: PortCollectorFactoryImpl,
    private latencyCollectorFactory: LatencyCollectorFactoryImpl,
  ) {

  }

  getCollector(type: CollectorType): CollectorFactory<any> {
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
    }
  }

}
