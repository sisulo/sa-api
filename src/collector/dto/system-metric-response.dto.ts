export class SystemMetricResponseDto {
  idMetric: number;
  idSystem: number;
  systemName: string;
  value: number;
  peak: number;
  date: Date;
  metricType: string;
}
