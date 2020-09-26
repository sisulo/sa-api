import { MetricRequestDto } from './metric-request.dto';
import { IsNotEmpty } from 'class-validator';

export class ParityGroupMetricRequestDto extends MetricRequestDto {
  @IsNotEmpty()
  readonly startTime: number;
  @IsNotEmpty()
  readonly endTime: number;
}