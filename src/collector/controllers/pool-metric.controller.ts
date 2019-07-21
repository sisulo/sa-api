import { Body, Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { PoolMetricRequestDto } from '../dto/pool-metric-request.dto';
import { PoolMetricService } from '../services/pool-metric.service';
import { PoolMetricResponseTransformer } from '../transformers/pool-metric-response.transformer';
import { PoolMetricResponseDto } from '../dto/pool-metric-response.dto';
import { LoggingInterceptor } from '../../logging.interceptor';

@Controller('/api/v1/systems/:idSystem/pools')
@UseInterceptors(LoggingInterceptor)
export class PoolMetricController {

  constructor(readonly service: PoolMetricService) {
  }

  @Post(':idPool/metrics')
  async upsert(@Param('idSystem') idSystem: string, @Param('idPool') idPool: string, @Body() request: PoolMetricRequestDto): Promise<PoolMetricResponseDto> {
    const metric = await this.service.upsert(parseInt(idSystem, 10), parseInt(idPool, 10), request).then(dao => dao);
    return PoolMetricResponseTransformer.transform(metric);
  }
}
