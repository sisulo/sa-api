import { CollectorUtils } from '../../tests/collector.utils';
import { TransformationError } from './transformation.error';
import { ChaMetricResponseTransformer } from './cha-metric-response.transformer';
import { ChaMetricEntity } from '../entities/cha-metric.entity';
import { ChaMetricResponseDto } from '../dto/cha-metric-response.dto';

describe('ChaMetricResponseTransformer', () => {
  let transformer: ChaMetricResponseTransformer;
  beforeEach(() => {
    transformer = new ChaMetricResponseTransformer();
  });

  it('should return ChaMetricResponse from ChaMetricEntity', () => {
    const entity: ChaMetricEntity = CollectorUtils.createChaMetricEntity();
    const result: ChaMetricResponseDto = CollectorUtils.createChaMetricResponseDto();
    expect(transformer.transform(entity)).toStrictEqual(result);
  });

  it('should throw error when system is missing in entity', () => {
    const entity: ChaMetricEntity = CollectorUtils.createChaMetricEntity();
    entity.adapter.system = null;
    expect(() => {
      transformer.transform(entity);
    }).toThrowError(TransformationError);
  });

  it('should throw error when adapter is missing in entity', () => {
    const entity: ChaMetricEntity = CollectorUtils.createChaMetricEntity();
    entity.adapter = null;
    expect(() => {
      transformer.transform(entity);
    }).toThrowError(TransformationError);
  });

  it('should throw error when metricType is missing in entity', () => {
    const entity: ChaMetricEntity = CollectorUtils.createChaMetricEntity();
    entity.metricTypeEntity = null;
    expect(() => {
      transformer.transform(entity);
    }).toThrowError(TransformationError);
  });

});
