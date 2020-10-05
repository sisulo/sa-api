import { Metric } from './Metric';

export class SystemMetric extends Metric {
  date: Date;
  startTime: number;
  endTime: number;
  peak: number;
}
