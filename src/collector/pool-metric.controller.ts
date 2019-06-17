import { Controller, Get } from '@nestjs/common';
import { PoolMetricService } from './pool-metric.service';
import { PoolMetric } from './entities/pool_metric';

@Controller('/api/v1/pools')
export class PoolMetricController {

  constructor(readonly service: PoolMetricService) {

  }

  @Get()
  findAll(): Promise<PoolMetric[] | never> {
    return this.service.findAll().then(value => {
      return value;
    });
  }
}
