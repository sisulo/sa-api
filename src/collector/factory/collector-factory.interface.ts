import { MetricResponseDto } from '../dto/metric-response.dto';
import { MetricRequestDto } from '../dto/metric-request.dto';
import { ComponentKey } from '../controllers/metric.controller';

export interface CollectorFactory<T> {
  collectMetric(componentKey: ComponentKey, request: MetricRequestDto): Promise<T>;

  transform(input: T): MetricResponseDto;
}
