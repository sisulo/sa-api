import { Body, Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { SystemMetricService } from '../services/system-metric.service';
import { SystemMetricRequestDto } from '../dto/system-metric-request.dto';
import { SystemMetricResponseTransformer } from '../transformers/system-metric-response.transformer';
import { SystemMetricResponseDto } from '../dto/system-metric-response.dto';
import { LoggingInterceptor } from '../../logging.interceptor';

@Controller('/api/v1/systems')
@UseInterceptors(LoggingInterceptor)
export class SystemMetricController {

  constructor(readonly service: SystemMetricService) {
  }

  @Post(':id/metrics')
  async upsert(@Param('id') id: string, @Body() request: SystemMetricRequestDto): Promise<SystemMetricResponseDto> {
    const metric = await this.service.upsert(parseInt(id, 10), request).then(dao => dao);
    return SystemMetricResponseTransformer.transform(metric);
  }
}
