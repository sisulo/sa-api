import { MetricResponseDto } from './metric-response.dto';
import { LatencyRequestDto } from './latency-request.dto';

export class LatencyResponseDto extends MetricResponseDto {

  operation: string;
  data: LatencyRequestDto[] = [];
}
