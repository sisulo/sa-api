import { Injectable } from '@nestjs/common';
import { StorageEntityStatus } from '../enums/storage-entity-status.enum';
import { StorageEntityRepository } from '../repositories/storage-entity.repository';
import { StorageEntityType } from '../dto/owner.dto';
import { StorageEntityEntity } from '../entities/storage-entity.entity';
import { PoolMetricReadEntity } from '../entities/pool-metric-read.entity';
import { HostGroupMetricReadEntity } from '../entities/host-group-metric-read.entity';

@Injectable()
export class CapacityStatisticsService {

  constructor(
    private readonly storageEntityRepository: StorageEntityRepository,
  ) {
  }

  getCapacityStatistics(): Promise<StorageEntityEntity[]> {
    return this.storageEntityRepository.createQueryBuilder('systems')
      .innerJoinAndSelect('systems.children', 'pool', 'pool.idType = :poolType', { poolType: StorageEntityType.POOL })
      .leftJoinAndMapMany('pool.metrics', PoolMetricReadEntity, 'metrics', 'metrics.owner = pool.id')
      .leftJoinAndSelect('metrics.metricTypeEntity', 'type')
      .where('pool.idCatComponentStatus = :idStatus', { idStatus: StorageEntityStatus.ACTIVE })
      .andWhere('systems.idCatComponentStatus = :idSystemStatus', { idSystemStatus: StorageEntityStatus.ACTIVE })
      .andWhere('systems.idType = :systemType', { systemType: StorageEntityType.SYSTEM })
      .getMany();
  }

  getHostGroupCapacityStatistics(): Promise<StorageEntityEntity[]> {
    return this.storageEntityRepository.createQueryBuilder('systems')
      .innerJoinAndSelect('systems.children', 'hostGroup', 'hostGroup.idType = :hostGroupType', { hostGroupType: StorageEntityType.HOST_GROUP })
      .leftJoinAndMapMany('hostGroup.metrics', HostGroupMetricReadEntity, 'metrics', 'metrics.owner = hostGroup.id')
      .leftJoinAndSelect('metrics.metricTypeEntity', 'type')
      .where('hostGroup.idCatComponentStatus = :idStatus', { idStatus: StorageEntityStatus.ACTIVE })
      .andWhere('systems.idCatComponentStatus = :idSystemStatus', { idSystemStatus: StorageEntityStatus.ACTIVE })
      .getMany();
  }

}
