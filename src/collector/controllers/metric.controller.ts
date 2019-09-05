import { Body, Controller, Param, Post } from '@nestjs/common';
import { HostGroupMetricResponseDto } from '../dto/host-group-metric-response.dto';
import { MetricRequestDto } from '../dto/metric-request.dto';
import { CollectorType } from '../factory/collector-type.enum';
import { ApiCollectorFactoryImpl } from '../factory/collectors/api-collector-factory.impl';
import { SystemMetricResponseDto } from '../dto/system-metric-response.dto';

@Controller('api/v1/systems/')
export class MetricController {
  constructor(private factory: ApiCollectorFactoryImpl) {
  }

  @Post(':systemName/:subComponent/:subComponentName/metrics')
  async insertCompositeComponentMetric(
    @Param('systemName') systemName: string,
    @Param('subComponent') subComponentType: CollectorType,
    @Param('subComponentName') subComponentName: string,
    @Body() dto: MetricRequestDto): Promise<HostGroupMetricResponseDto> {
    const collector = this.factory.getCollector(subComponentType);
    const metricEntity = await collector.collectMetric(subComponentName, systemName, dto);
    return collector.transform(metricEntity) as (HostGroupMetricResponseDto);
  }

  @Post(':systemName/metrics')
  async insertSimpleComponentMetric(
    @Param('systemName') systemName: string,
    @Body() dto: MetricRequestDto): Promise<SystemMetricResponseDto> {

    const collector = this.factory.getCollector(CollectorType.SYSTEMS);
    const metricEntity = await collector.collectMetric(systemName, null, dto);
    return collector.transform(metricEntity) as (SystemMetricResponseDto);
  }

}
