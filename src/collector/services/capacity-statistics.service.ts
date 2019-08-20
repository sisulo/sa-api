import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CapacityStatisticsEntity } from '../entities/capacity-statistics.entity';

@Injectable()
export class CapacityStatisticsService {

  constructor(
    @InjectRepository(CapacityStatisticsEntity)
    private readonly capacityStatisticsRepository: Repository<CapacityStatisticsEntity>,
  ) {
  }

  getCapacityStatistics(): Promise<CapacityStatisticsEntity[]> {
    return this.capacityStatisticsRepository.createQueryBuilder('metrics')
      .leftJoinAndSelect('metrics.metricTypeEntity', 'type')
      .getMany();
  }

}
