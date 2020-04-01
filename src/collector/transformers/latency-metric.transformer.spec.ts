import { CollectorUtils } from '../../tests/collector.utils';
import { LatencyEntity } from '../entities/latency.entity';
import { LatencyResponseDto } from '../dto/latency-response.dto';
import { LatencyMetricTransformer } from './latency-metric.transformer';

describe('Latency Transformers', () => {

  it('should return LatencyResponseDto from LatencyEntity', () => {
    const entity: LatencyEntity = CollectorUtils.createLatencyMetricEntity();
    const result: LatencyResponseDto = CollectorUtils.createLatencyResponseDto();
    expect(LatencyMetricTransformer.transform([entity])).toStrictEqual(result);
  });
});
