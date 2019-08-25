import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemEntity } from '../entities/system.entity';

@Injectable()
export class CapacityStatisticsService {

  constructor(
    @InjectRepository(SystemEntity)
    private readonly entityRepository: Repository<SystemEntity>,
  ) {
  }

  getCapacityStatistics(): Promise<SystemEntity[]> {
    return this.entityRepository.createQueryBuilder('systems')
      .leftJoinAndSelect('systems.pools', 'pools')
      .leftJoinAndSelect('pools.metrics', 'metrics')
      .leftJoinAndSelect('metrics.metricTypeEntity', 'type')
      .getMany();
  }

}
