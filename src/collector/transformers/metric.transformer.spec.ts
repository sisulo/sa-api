import { CollectorUtils } from '../../tests/collector.utils';
import { PoolMetricEntity } from '../entities/pool-metric.entity';
import { MetricTransformer } from './metric.transformer';
import { MetricResponseDto } from '../dto/metric-response.dto';
import { SystemMetricEntity } from '../entities/system-metric.entity';
import { ChaMetricEntity } from '../entities/cha-metric.entity';
import { HostGroupMetricEntity } from '../entities/host-group-metric.entity';
import { PortMetricEntity } from '../entities/port-metric.entity';
import { TransformationError } from './transformation.error';

describe('Transformer', () => {

  it('should return MetricOwnerResponseTransformer from SystemMetricEntity', () => {
    const entity: SystemMetricEntity = CollectorUtils.createSystemMetricEntity();
    const result: MetricResponseDto = CollectorUtils.createSystemMetricOwnerResponseDto();
    expect(MetricTransformer.transform(entity)).toStrictEqual(result);
  });
  it('should return MetricOwnerResponseTransformer from PoolMetricEntity', () => {
    const entity: PoolMetricEntity = CollectorUtils.createPoolMetricEntity();
    const result: MetricResponseDto = CollectorUtils.createPoolMetricOwnerResponseDto();
    expect(MetricTransformer.transform(entity)).toStrictEqual(result);
  });
  it('should return MetricOwnerResponseTransformer from ChaMetricEntity', () => {
    const entity: ChaMetricEntity = CollectorUtils.createChaMetricEntity();
    const result: MetricResponseDto = CollectorUtils.createChaMetricOwnerResponseDto();
    expect(MetricTransformer.transform(entity)).toStrictEqual(result);
  });
  it('should return MetricOwnerResponseTransformer from HostGroupMetricEntity', () => {
    const entity: HostGroupMetricEntity = CollectorUtils.createHostGroupMetricEntity();
    const result: MetricResponseDto = CollectorUtils.createHostGroupMetricResponseDto();
    expect(MetricTransformer.transform(entity)).toStrictEqual(result);
  });
  it('should return MetricOwnerResponseTransformer from PortMetricEntity', () => {
    const entity: PortMetricEntity = CollectorUtils.createPortMetricEntity();
    const result: MetricResponseDto = CollectorUtils.createPortMetricOwnerResponseDto();
    expect(MetricTransformer.transform(entity)).toStrictEqual(result);
  });
  it('thrown Exception when owner is null', () => {
    const entity: PortMetricEntity = CollectorUtils.createPortMetricEntity();
    entity.owner = null;
    expect(() => {
      MetricTransformer.transform(entity);
    }).toThrowError(TransformationError);
  });
  it('thrown Exception when metricTypeEntity is null', () => {
    const entity: PortMetricEntity = CollectorUtils.createPortMetricEntity();
    entity.metricTypeEntity = null;
    expect(() => {
      MetricTransformer.transform(entity);
    }).toThrowError(TransformationError);
  });

});
