import { IsNotEmpty } from 'class-validator';

export class ParityGroupMetricRequestDto {
  @IsNotEmpty()
  readonly startTime: number;
  @IsNotEmpty()
  readonly endTime: number;

  readonly value: number;

  readonly peak: number;
}