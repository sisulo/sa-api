import { CollectorUtils } from '../../tests/collector.utils';
import { TransformationError } from './transformation.error';
import { PortMetricResponseTransformer } from './port-metric-response.transformer';
import { PortMetricEntity } from '../entities/port-metric.entity';
import { PortMetricResponseDto } from '../dto/port-metric-response.dto';

describe('PortMetricResponseTransformer', () => {
  let transformer: PortMetricResponseTransformer;
  beforeEach(() => {
    transformer = new PortMetricResponseTransformer();
  });

  it('should return ChaMetricResponse from ChaMetricEntity', () => {
    const entity: PortMetricEntity = CollectorUtils.createPortMetricEntity();
    const result: PortMetricResponseDto = CollectorUtils.createPortMetricResponseDto();
    expect(transformer.transform(entity)).toStrictEqual(result);
  });

  it('should throw error when owner is missing in entity', () => {
    const entity: PortMetricEntity = CollectorUtils.createPortMetricEntity();
    entity.owner.system = null;
    expect(() => {
      transformer.transform(entity);
    }).toThrowError(TransformationError);
  });

  it('should throw error when adapter is missing in entity', () => {
    const entity: PortMetricEntity = CollectorUtils.createPortMetricEntity();
    entity.owner = null;
    expect(() => {
      transformer.transform(entity);
    }).toThrowError(TransformationError);
  });

  it('should throw error when metricType is missing in entity', () => {
    const entity: PortMetricEntity = CollectorUtils.createPortMetricEntity();
    entity.metricTypeEntity = null;
    expect(() => {
      transformer.transform(entity);
    }).toThrowError(TransformationError);
  });

});
