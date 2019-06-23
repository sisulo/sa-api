import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { SystemMetricService } from '../system-metric.service';
import { SystemMetricEntity } from '../entities/system-metric.entity';
import { SystemMetricRequestDto } from '../dto/system-metric-request.dto';

@Controller('/api/v1/systems')
export class SystemMetricController {

  constructor(readonly service: SystemMetricService) {

  }

  // TODO respond with ResponseDto
  @Post(':id/metrics')
  upsert(@Param('id') id: string, @Body() request: SystemMetricRequestDto): Promise<SystemMetricEntity> {
    return this.service.upsert(parseInt(id, 10), request).then(value => {
      return value;
    });
  }
}
