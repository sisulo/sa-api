import { MetricResponseDto } from './metric-response.dto';

export class HostGroupMetricResponseDto extends MetricResponseDto {
  idHostGroup: number;
  hostGroupName: string;
}
