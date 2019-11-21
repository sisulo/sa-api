import { Body, Controller, Param, Post } from '@nestjs/common';
import { HostGroupMetricResponseDto } from '../dto/host-group-metric-response.dto';
import { MetricRequestDto } from '../dto/metric-request.dto';
import { CollectorType } from '../factory/collector-type.enum';
import { ApiCollectorFactoryImpl } from '../factory/collectors/api-collector-factory.impl';
import { SystemMetricResponseDto } from '../dto/system-metric-response.dto';

export interface ComponentKey {
  parentName: string;
  grandParentName: string;
  childName: string;
}

@Controller('api/v1/systems/')
export class MetricController {
  constructor(private factory: ApiCollectorFactoryImpl) {
  }

  @Post(':systemName/chas/:subComponentName/ports/:portName/metrics')
  async insertPortMetric(
    @Param('systemName') systemName: string,
    @Param('subComponent') subComponentType: CollectorType,
    @Param('subComponentName') subComponentName: string,
    @Param('portName') portName: string,
    @Body() dto: MetricRequestDto): Promise<HostGroupMetricResponseDto> {
    const collector = this.factory.getCollector(CollectorType.PORTS);
    const componentKey = { parentName: subComponentName, grandParentName: systemName, childName: portName } as ComponentKey;
    const metricEntity = await collector.collectMetric(componentKey, dto);
    return collector.transform(metricEntity) as (HostGroupMetricResponseDto);
  }

  @Post(':systemName/:subComponent/:subComponentName/metrics')
  async insertCompositeComponentMetric(
    @Param('systemName') systemName: string,
    @Param('subComponent') subComponentType: CollectorType,
    @Param('subComponentName') subComponentName: string,
    @Body() dto: MetricRequestDto): Promise<HostGroupMetricResponseDto> {
    const collector = this.factory.getCollector(subComponentType);
    const componentKey = { childName: subComponentName, parentName: systemName } as ComponentKey;
    const metricEntity = await collector.collectMetric(componentKey, dto);
    return collector.transform(metricEntity) as (HostGroupMetricResponseDto);
  }

  @Post(':systemName/metrics')
  async insertSimpleComponentMetric(
    @Param('systemName') systemName: string,
    @Body() dto: MetricRequestDto): Promise<SystemMetricResponseDto> {

    const collector = this.factory.getCollector(CollectorType.SYSTEMS);
    const componentKey = { childName: systemName } as ComponentKey;
    const metricEntity = await collector.collectMetric(componentKey, dto);
    return collector.transform(metricEntity) as (SystemMetricResponseDto);
  }

}
