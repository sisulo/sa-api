import { Owner } from './owner.dto';

export class MetricResponseDto {
  idMetric: number;
  value: number;
  peak: number;
  date: Date;
  metricType: string;
  startTime: number;
  endTime: number;
  owner: Owner;
}
