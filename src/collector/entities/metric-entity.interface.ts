import { CatMetricTypeEntity } from './cat-metric-type.entity';

export interface MetricEntityInterface {
  id: number;
  value: number;
  date: Date;
  metricTypeEntity: CatMetricTypeEntity;
}
