import { MetricRequestDto } from '../../dto/metric-request.dto';
import { ComponentKey } from '../../controllers/metric.controller';
import { CommonMetricService } from '../../services/common-metric.service';
import { AbstractMetricEntity } from '../../entities/abstract-metric.entity';
import { StorageEntityInterface } from '../../entities/storage-entity.interface';

export class CollectorGeneric<MetricEntityType extends AbstractMetricEntity,
  ChildComponentType extends StorageEntityInterface,
  ParentComponentType,
  GrandParentComponentType> {

  constructor(protected service: CommonMetricService<MetricEntityType, ChildComponentType, ParentComponentType, GrandParentComponentType>) {
  }

  async collectMetric(componentKey: ComponentKey, request: MetricRequestDto): Promise<MetricEntityType> {
    return await this.service.createOrUpdateMetric(componentKey, request);
  }

}
