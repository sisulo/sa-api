import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PerformanceMetricTransformer } from '../performance-metric.transformer';
import { DataCenterService, MetricGroup } from '../../collector/services/data-center.service';
import { DataCenterEntity } from '../../collector/entities/data-center.entity';
import { AdapterMetricTransformer } from '../adapter-metric.transformer';
import { CapacityMetricTransformer } from '../capacity-metric.transformer';
import { HostGroupMetricTransformer } from '../host-group-metric.transformer';

@Injectable()
export class DataCenterStatisticsService {
  constructor(private dataCenterService: DataCenterService) {
  }

  private static transform(metricGroup: MetricGroup, entity: DataCenterEntity[]) {
    switch (metricGroup) {
      case MetricGroup.CAPACITY:
      case MetricGroup.SLA:
        return CapacityMetricTransformer.transform(entity);
      case MetricGroup.ADAPTERS:
        return AdapterMetricTransformer.transform(entity);
      case MetricGroup.PERFORMANCE:
        return PerformanceMetricTransformer.transform(entity);
      case MetricGroup.HOSTGROUPS:
        return HostGroupMetricTransformer.transform(entity);
      default:
        throw new BadRequestException(`Cannot transform DataCenterEntity for metricGroup(${metricGroup})`);
    }
  }

  async getMetricByIdDataCenter(metricGroup: MetricGroup, idDataCenter: number, date: Date) {
    const dataCenterEntity = await this.getEntities(metricGroup, idDataCenter, date);
    if (dataCenterEntity !== undefined) {
      return DataCenterStatisticsService.transform(metricGroup, dataCenterEntity);
    } else {
      throw new NotFoundException(`No data found DataCenter(${idDataCenter})`);
    }
  }

  async getEntities(metricGroup: MetricGroup, idDataCenter: number, date: Date): Promise<DataCenterEntity[]> {
    return await this.dataCenterService.getMetricsByGroup(metricGroup, idDataCenter);
  }

}
