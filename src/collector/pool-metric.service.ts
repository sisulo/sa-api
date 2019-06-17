import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PoolMetric } from './entities/pool_metric';

@Injectable()
export class PoolMetricService {
  constructor(
    @InjectRepository(PoolMetric)
    private readonly poolMetricRepository: Repository<PoolMetric>,
  ) {}

  async findAll(): Promise<PoolMetric[]> {
    const metrics = await this.poolMetricRepository.find();
    return metrics;

  }
}
