import { Injectable } from '@nestjs/common';
import { DataCenterService } from '../../collector/services/data-center.service';
import { MetricType } from '../../collector/enums/metric-type.enum';
import { WeightedAverageImpl } from '../aggregations/weight-average.impl';
import { SumImpl } from '../aggregations/sum.impl';
import { DataCenterEntity } from '../../collector/entities/data-center.entity';
import { MetricTypeService } from '../../collector/services/metric-type.service';
import { Region } from '../models/dtos/region.enum';
import { MetricEntityInterface } from '../../collector/entities/metric-entity.interface';

export interface RegionMetricInterface {
  region: Region;
  metrics: MetricEntityInterface[];
}

@Injectable()
export class AggregatedMetricService {

  aggregationStrategies = [
    {
      metricType: [MetricType.TOTAL_SAVING_EFFECT],
      algorithm: new WeightedAverageImpl(),
      options: { weightType: MetricType.PHYSICAL_CAPACITY, ignoreValueUnder: 1 },
    },
    {
      metricType: [MetricType.LOGICAL_CAPACITY, MetricType.SUBSCRIBED_CAPACITY, MetricType.CHANGE_MONTH, MetricType.PHYSICAL_CAPACITY],
      algorithm: new SumImpl(),
      options: null,
    },
  ];

  constructor(private dataCenterMetricService: DataCenterService,
              private metricTypeService: MetricTypeService) {
  }

  public async fetchAggregatedMetrics(types: MetricType[]) {
    return Promise.all(await this.fetchAndAggregateMetrics(types, []));
  }

  public async fetchAggregatedMetricsGrouped(types: MetricType[], regions: Region[]): Promise<RegionMetricInterface[]> {
    return await Promise.all(regions.map(async group => {
      return { region: group, metrics: await this.fetchAndAggregateMetrics(types, this.dataCenterMetricService.getDataCenterIdByRegion(group)) };
    }));
  }

  private async fetchAndAggregateMetrics(types: MetricType[], dataCenterIds: number[]): Promise<MetricEntityInterface[]> {
    const entities = await this.dataCenterMetricService.getPoolMetrics(this.resolveFetchingMetricTypes(types), dataCenterIds);
    const metrics = this.fetchMetricsOnly(entities);
    const aggValues = [];
    await Promise.all(types.map(async type => {
        const config = this.getStrategy(type);
        const aggValue = config.algorithm.aggregate(metrics, type, config.options);
        aggValue.metricTypeEntity = await this.metricTypeService.findById(type);
        aggValues.push(aggValue);
      },
    ));

    return aggValues;
  }

  private fetchMetricsOnly(entities: DataCenterEntity[]): any[] {
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

  private resolveFetchingMetricTypes(types: MetricType[]): MetricType[] {
    const result = types.map(type => type);
    types.forEach(
      type => {
        const strategy = this.getStrategy(type);
        if (strategy.options != null && strategy.options.weightType != null) {
          result.push(strategy.options.weightType);
        }
      },
    );
    return result;
  }

  private getStrategy(type: MetricType) {
    return this.aggregationStrategies.find(strategy => strategy.metricType.some(metricTypeDef => type === metricTypeDef));
  }
}
