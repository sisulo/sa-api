import { MetricAggregationInterface } from './metric-aggregation.interface';
import { MetricType } from '../../collector/enums/metric-type.enum';
import { MetricEntityInterface } from '../../collector/entities/metric-entity.interface';

export abstract class AggregationAlgorithmAbstract implements MetricAggregationInterface {

  abstract aggregate(entities: MetricEntityInterface[][], metricType: MetricType, options: any): MetricEntityInterface;

  findMetricByType(entity, type: MetricType): MetricEntityInterface {
    return entity.find(metric => metric.metricTypeEntity.idCatMetricType === type);
  }
}
