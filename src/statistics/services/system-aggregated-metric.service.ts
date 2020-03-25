import { AggregatedMetricService } from './aggregated-metric.service';
import { DataCenterService } from '../../collector/services/data-center.service';
import { MetricTypeService } from '../../collector/services/metric-type.service';
import { MetricType } from '../../collector/enums/metric-type.enum';
import { DataCenterEntity } from '../../collector/entities/data-center.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SystemAggregatedMetricService extends AggregatedMetricService {
  constructor(protected dcService: DataCenterService,
              protected typeService: MetricTypeService) {
    super(dcService, typeService);
  }

  getData(types: MetricType[], dataCenterIds: number[]) {
    return this.dcService.getPerformanceMetrics(types, dataCenterIds);
  }

  fetchMetricsOnly(entities: DataCenterEntity[]): any[] {
    const result = [];
    entities.forEach(dataCenter =>
      dataCenter.systems.forEach(system =>
          // owner.pools.forEach(owner =>
          result.push(system.metrics),
        // ),
      ),
    );
    return result;
  }
}
