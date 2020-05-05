import { SystemMetric } from '../metrics/SystemMetric';

export class StorageEntityMetricDto {
  id: number;
  name: string;
  type: string;
  status: string;
  serialNumber: string;
  children: StorageEntityMetricDto[];
  metrics: SystemMetric[];
}
