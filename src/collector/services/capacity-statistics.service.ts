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

  async getCapacityStatistics(): Promise<CapacityStatisticsEntity> {
    return await this.capacityStatisticsRepository.findOne();
  }

}
