import { CollectorUtils } from '../../tests/collector.utils';
import { TransformationError } from './transformation.error';
import { PoolMetricResponseTransformer } from './pool-metric-response.transformer';
import { PoolMetricEntity } from '../entities/pool-metric.entity';
import { PoolMetricResponseDto } from '../dto/pool-metric-response.dto';

describe('PoolMetricResponseTransformer', () => {
  let transformer: PoolMetricResponseTransformer;
  beforeEach(() => {
    transformer = new PoolMetricResponseTransformer();
  });

  it('should return PoolMetricResponseDto from PoolMetricEntity', () => {
    const entity: PoolMetricEntity = CollectorUtils.createPoolMetricEntity();
    const result: PoolMetricResponseDto = CollectorUtils.createPoolMetricResponseDto();
    expect(transformer.transform(entity)).toStrictEqual(result);
  });

  it('should throw error when owner missing in PoolMetricEntity', () => {
    const entity: PoolMetricEntity = CollectorUtils.createPoolMetricEntity();
    entity.owner = null;
    const result: PoolMetricResponseDto = CollectorUtils.createPoolMetricResponseDto();
    expect(() => {
      transformer.transform(entity);
    }).toThrowError(TransformationError);
  });
  it('should throw error when owner missing in PoolMetricEntity', () => {
    const entity: PoolMetricEntity = CollectorUtils.createPoolMetricEntity();
    entity.owner.system = null;
    const result: PoolMetricResponseDto = CollectorUtils.createPoolMetricResponseDto();
    expect(() => {
      transformer.transform(entity);
    }).toThrowError(TransformationError);
  });
  it('should throw error when metricType missing in PoolMetricEntity', () => {
    const entity: PoolMetricEntity = CollectorUtils.createPoolMetricEntity();
    entity.metricTypeEntity = null;
    const result: PoolMetricResponseDto = CollectorUtils.createPoolMetricResponseDto();
    expect(() => {
      transformer.transform(entity);
    }).toThrowError(TransformationError);
  });
});
