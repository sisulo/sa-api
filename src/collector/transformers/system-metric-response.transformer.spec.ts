import { CollectorUtils } from '../../tests/collector.utils';
import { TransformationError } from './transformation.error';
import { SystemMetricResponseTransformer } from './system-metric-response.transformer';
import { SystemMetricEntity } from '../entities/system-metric.entity';
import { SystemMetricResponseDto } from '../dto/system-metric-response.dto';

describe('SystemMetricResponseTransformer', () => {
  let transformer: SystemMetricResponseTransformer;
  beforeEach(() => {
    transformer = new SystemMetricResponseTransformer();
  });

  it('should return SystemMetricResponseDto from SystemMetricEntity', () => {
    const entity: SystemMetricEntity = CollectorUtils.createSystemMetricEntity();
    const result: SystemMetricResponseDto = CollectorUtils.createSystemMetricResponseDto();
    expect(transformer.transform(entity)).toStrictEqual(result);
  });

  it('should throw error when system missing in SystemMetricEntity', () => {
    const entity: SystemMetricEntity = CollectorUtils.createSystemMetricEntity();
    entity.system = null;
    expect(() => {
      transformer.transform(entity);
    }).toThrowError(TransformationError);
  });
  it('should throw error when metricType missing in PoolMetricEntity', () => {
    const entity: SystemMetricEntity = CollectorUtils.createSystemMetricEntity();
    entity.metricTypeEntity = null;
    expect(() => {
      transformer.transform(entity);
    }).toThrowError(TransformationError);
  });
});
