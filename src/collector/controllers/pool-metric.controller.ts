import { Body, Controller, Param, Post } from '@nestjs/common';
import { PoolMetricRequestDto } from '../dto/pool-metric-request.dto';
import { PoolMetricService } from '../pool-metric.service';
import { PoolMetricEntity } from '../entities/pool-metric.entity';

@Controller('/api/v1/systems/:idSystem/pools')
export class PoolMetricController {

  constructor(readonly service: PoolMetricService) {
  }

// TODO respond with ResponseDto
  @Post(':idPool/metrics')
  upsert(@Param('idSystem') idSystem: string, @Param('idPool') idPool: string, @Body() request: PoolMetricRequestDto): Promise<PoolMetricEntity> {
    return this.service.upsert(parseInt(idSystem, 10), parseInt(idPool, 10), request).then(value => {
      return value;
    });
  }
}
