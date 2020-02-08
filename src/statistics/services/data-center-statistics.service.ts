import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PerformanceMetricTransformer } from '../performance-metric.transformer';
import { DataCenterService, MetricGroup } from '../../collector/services/data-center.service';
import { DataCenterEntity } from '../../collector/entities/data-center.entity';
import { AdapterMetricTransformer } from '../adapter-metric.transformer';
import { CapacityMetricTransformer } from '../capacity-metric.transformer';
import { HostGroupMetricTransformer } from '../host-group-metric.transformer';
import { DatacenterCapacityListDto } from '../models/dtos/datacenter-capacity-list.dto';
import { DatacenterPerfListDto } from '../models/dtos/datacenter-perf-list.dto';
import { ChaMetricService } from '../../collector/services/cha-metric.service';
import { PoolMetricService } from '../../collector/services/pool-metric.service';
import { MetricEntityInterface } from '../../collector/entities/metric-entity.interface';
import { SystemMetricService } from '../../collector/services/system-metric.service';
import { PeriodType } from '../../collector/enums/period-type.enum';
import { PortMetricService } from '../../collector/services/port-metric.service';

@Injectable()
export class DataCenterStatisticsService {
  constructor(private dataCenterService: DataCenterService,
              private chaMetricService: ChaMetricService,
              private portMetricService: PortMetricService,
              private poolMetricService: PoolMetricService,
              private systemMetricService: SystemMetricService) {
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
      case MetricGroup.HOST_GROUPS:
        return HostGroupMetricTransformer.transform(entity);
      default:
        throw new BadRequestException(`Cannot transform DataCenterEntity for metricGroup(${metricGroup})`);
    }
  }

  async getMetricByIdDataCenter(metricGroup: MetricGroup, idDataCenter: number, period?: PeriodType)
    : Promise<DatacenterCapacityListDto | DatacenterPerfListDto> {
    const dataCenterEntity = await this.getEntities(metricGroup, idDataCenter, period);
    if (dataCenterEntity !== undefined) {
      return DataCenterStatisticsService.transform(metricGroup, dataCenterEntity);
    } else {
      throw new NotFoundException(`No data found DataCenter(${idDataCenter})`);
    }
  }

  async getEntities(metricGroup: MetricGroup, idDataCenter: number, period: PeriodType): Promise<DataCenterEntity[]> {
    return await this.dataCenterService.getMetricsByGroup(metricGroup, idDataCenter, period);
  }

  public async getAlerts(): Promise<MetricEntityInterface[]> {
    const alerts = await this.chaMetricService.getAlerts();
    const portAlerts = await this.portMetricService.getAlerts();
    const poolAlerts = await this.poolMetricService.getAlerts();
    const systemAlerts = await this.systemMetricService.getAlerts();
    return [...alerts, ...poolAlerts, ...systemAlerts, ...portAlerts];
  }
}
