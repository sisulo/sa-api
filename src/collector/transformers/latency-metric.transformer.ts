import { LatencyEntity } from '../entities/latency.entity';
import { LatencyResponseDto } from '../dto/latency-response.dto';
import { LatencyMetricDto } from '../dto/latency-metric.dto';
import { MetricTransformer } from './metric.transformer';

export class LatencyMetricTransformer {

  public static transform(metrics: LatencyEntity[]): LatencyResponseDto {
    const response = new LatencyResponseDto();
    response.data = metrics.map(
      metric => LatencyMetricTransformer.transformMetric(metric),
    );
    return response;
  }

  private static transformMetric(metric: LatencyEntity) {
    // little hack for tests, fields from MetricResponseDto must be copied to created object LatencyMetricDto
    const dto: LatencyMetricDto = Object.assign(new LatencyMetricDto(), MetricTransformer.transform(metric)) as LatencyMetricDto;
    dto.latency = metric.latency;
    dto.blockSize = metric.blockSize;
    dto.operationType = metric.idOperation;

    return dto;
  }
}
