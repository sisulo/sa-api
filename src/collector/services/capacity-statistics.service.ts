import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemEntity } from '../entities/system.entity';
import { ComponentStatus } from '../enums/component.status';

@Injectable()
export class CapacityStatisticsService {

  constructor(
    @InjectRepository(SystemEntity)
    private readonly entityRepository: Repository<SystemEntity>,
  ) {
  }

  getCapacityStatistics(): Promise<SystemEntity[]> {
    return this.entityRepository.createQueryBuilder('systems')
      .innerJoinAndSelect('systems.pools', 'pool')
      .leftJoinAndSelect('pool.metrics', 'metrics')
      .leftJoinAndSelect('metrics.metricTypeEntity', 'type')
      .where('pool.idCatComponentStatus = :idStatus', {idStatus: ComponentStatus.ACTIVE})
      .andWhere('systems.idCatComponentStatus = :idSystemStatus', {idSystemStatus : ComponentStatus.ACTIVE})
      .getMany();
  }

  getHostGroupCapacityStatistics(): Promise<SystemEntity[]> {
    return this.entityRepository.createQueryBuilder('systems')
      .innerJoinAndSelect('systems.hostGroups', 'hostGroup')
      .leftJoinAndSelect('hostGroup.metrics', 'metrics')
      .leftJoinAndSelect('metrics.metricTypeEntity', 'type')
      .where('hostGroup.idCatComponentStatus = :idStatus', {idStatus: ComponentStatus.ACTIVE})
      .andWhere('systems.idCatComponentStatus = :idSystemStatus', {idSystemStatus : ComponentStatus.ACTIVE})
      .getMany();
  }

}
