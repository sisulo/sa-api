import { MetricRequestDto } from './metric-request.dto';

export class SystemMetricRequestDto extends MetricRequestDto {

  readonly peak: number;
}
