import { HostGroupMetricResponseTransformer } from './host-group-metric-response.transformer';
import { HostGroupMetricEntity } from '../entities/host-group-metric.entity';
import { CollectorUtils } from '../../tests/collector.utils';
import { HostGroupMetricResponseDto } from '../dto/host-group-metric-response.dto';
import { TransformationError } from './transformation.error';

describe('HostGroupMetricResponseTransformer', () => {
  let transformer: HostGroupMetricResponseTransformer;
  beforeEach(() => {
    transformer = new HostGroupMetricResponseTransformer();
  });

  it('should return HostGroupMetricResponse from HostGroupMetricEntity', () => {
    const entity: HostGroupMetricEntity = CollectorUtils.createHostGroupEntity();
    const result: HostGroupMetricResponseDto = CollectorUtils.createHostGroupMetricResponseDto();
    expect(transformer.transform(entity)).toStrictEqual(result);
  });

  it('should throw error when owner is missing in entity', () => {
    const entity: HostGroupMetricEntity = CollectorUtils.createHostGroupEntity();
    entity.owner.system = null;
    const result: HostGroupMetricResponseDto = CollectorUtils.createHostGroupMetricResponseDto();
    expect(() => {
      transformer.transform(entity);
    }).toThrowError(TransformationError);
  });

  it('should throw error when hostgroup is missing in entity', () => {
    const entity: HostGroupMetricEntity = CollectorUtils.createHostGroupEntity();
    entity.owner = null;
    const result: HostGroupMetricResponseDto = CollectorUtils.createHostGroupMetricResponseDto();
    expect(() => {
      transformer.transform(entity);
    }).toThrowError(TransformationError);
  });

  it('should throw error when hostgroup is missing in entity', () => {
    const entity: HostGroupMetricEntity = CollectorUtils.createHostGroupEntity();
    entity.metricTypeEntity = null;
    const result: HostGroupMetricResponseDto = CollectorUtils.createHostGroupMetricResponseDto();
    expect(() => {
      transformer.transform(entity);
    }).toThrowError(TransformationError);
  });
});
