import { CollectorType } from './collector-type.enum';
import { PoolService } from '../services/pool.service';
import { PortService } from '../services/port.service';
import { ChaService } from '../services/cha.service';
import { SystemService } from '../services/system.service';
import { HostGroupService } from '../services/host-group.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ComponentServiceFactory {
  constructor(private poolService: PoolService,
              private portService: PortService,
              private chaService: ChaService,
              private systemService: SystemService,
              private hostGroupService: HostGroupService) {
  }

  getComponentService(type: CollectorType) {
    switch (type) {
      case CollectorType.POOLS:
        return this.poolService;
      case CollectorType.PORTS:
        return this.portService;
      case CollectorType.CHAS:
        return this.chaService;
      case CollectorType.SYSTEMS:
        return this.systemService;
      case CollectorType.HOST_GROUPS:
        return this.hostGroupService;
      // TODO throw exception when default
    }
  }
}
