import { SystemDetail } from './models/SystemDetail';

export class PerformanceMetricResponseDto {
  id: number;
  label: string;
  systems: SystemDetail[];
}
