import { Alert } from './Alert';
import { RegionMetricDto } from '../dtos/region-metric.dto';

export class InfrastructureDto {
  alerts: Alert[];
  metrics: RegionMetricDto[];
}
