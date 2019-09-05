import { MetricResponseDto } from '../dto/metric-response.dto';
import { MetricRequestDto } from '../dto/metric-request.dto';

export interface CollectorFactory<T> {
  collectMetric(childComponentName: string, parentComponentName: string, request: MetricRequestDto): Promise<T>;

  transform(input: T): MetricResponseDto;
}
