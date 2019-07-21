import { SystemDetail } from '../SystemDetail';

export class PerformanceStatisticsDto {
  id: number;
  label: string;
  systems: SystemDetail[] = [];
}
