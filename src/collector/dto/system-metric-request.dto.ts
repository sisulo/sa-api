import { MetricCommonDto } from './metric-common.dto';

export class SystemMetricRequestDto extends MetricCommonDto {

  readonly peak: number;
}
