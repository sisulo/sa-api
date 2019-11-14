import { AggregatedMetricService } from './aggregated-metric.service';
import { Injectable } from '@nestjs/common';
import { DataCenterService } from '../../collector/services/data-center.service';
import { MetricTypeService } from '../../collector/services/metric-type.service';
import { DataCenterEntity } from '../../collector/entities/data-center.entity';
import { MetricType } from '../../collector/enums/metric-type.enum';

@Injectable()
export class PoolAggregatedMetricService extends AggregatedMetricService {
  constructor(protected dcService: DataCenterService,
              protected typeService: MetricTypeService) {
    super(dcService, typeService);
  }

  fetchMetricsOnly(entities: DataCenterEntity[]): any[] {
    const result = [];
    entities.forEach(dataCenter =>
      dataCenter.systems.forEach(system =>
        system.pools.forEach(pool =>
          result.push(pool.metrics),
        ),
      ),
    );
    return result;
  }

  getData(types: MetricType[], dataCenterIds: number[]) {
    return this.dcService.getPoolMetrics(types, dataCenterIds);
  }
}
