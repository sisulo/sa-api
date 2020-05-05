import { Injectable, NotFoundException } from '@nestjs/common';
import { DataCenterService, MetricGroup } from '../../collector/services/data-center.service';
import { StorageEntityMetricTransformer } from '../transformers/storage-entity-metric.transformer';
import { ChaMetricService } from '../../collector/services/cha-metric.service';
import { PoolMetricService } from '../../collector/services/pool-metric.service';
import { MetricEntityInterface } from '../../collector/entities/metric-entity.interface';
import { SystemMetricService } from '../../collector/services/system-metric.service';
import { PeriodType } from '../../collector/enums/period-type.enum';
import { PortMetricService } from '../../collector/services/port-metric.service';
import { StorageEntityEntity } from '../../collector/entities/storage-entity.entity';
import { StorageEntityMetricDto } from '../models/dtos/storage-entity-metric.dto';

@Injectable()
export class DataCenterStatisticsService {
  constructor(private dataCenterService: DataCenterService,
              private chaMetricService: ChaMetricService,
              private portMetricService: PortMetricService,
              private poolMetricService: PoolMetricService,
              private systemMetricService: SystemMetricService) {
  }

  async getMetricByIdDataCenter(metricGroup: MetricGroup, idDataCenter: number = null, period?: PeriodType)
    : Promise<StorageEntityMetricDto[]> {
    const dataCenterEntity = await this.getEntities(metricGroup, idDataCenter, period);
    if (dataCenterEntity !== undefined) {
      return StorageEntityMetricTransformer.transform(dataCenterEntity);
    } else {
      throw new NotFoundException(`No data found DataCenter(${idDataCenter})`);
    }
  }

  async getEntities(metricGroup: MetricGroup, idDataCenter: number, period: PeriodType): Promise<StorageEntityEntity[]> {
    return await this.dataCenterService.getMetricsByGroup(metricGroup, idDataCenter, period);
  }

  // TODO iterate over array of service (with getAlerts) and return all values
  public async getAlerts(): Promise<MetricEntityInterface[]> {
    const alerts = await this.chaMetricService.getAlerts();
    const portAlerts = await this.portMetricService.getAlerts();
    const poolAlerts = await this.poolMetricService.getAlerts();
    const systemAlerts = await this.systemMetricService.getAlerts();
    return [...alerts, ...poolAlerts, ...systemAlerts, ...portAlerts];
  }
}
