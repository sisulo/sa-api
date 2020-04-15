import { Injectable } from '@nestjs/common';
import { MetricRequestDto } from '../../dto/metric-request.dto';
import { StorageEntityRepository } from '../../repositories/storage-entity.repository';
import { MetricRepositoryFactory } from '../../factory/metric-repository.factory';
import { AbstractMetricEntity } from '../../entities/abstract-metric.entity';
import { StorageEntityEntity } from '../../entities/storage-entity.entity';
import { AbstractMetricCollectorService } from './abstract-metric-collector.service';
import { SystemMetricEntity } from '../../entities/system-metric.entity';

@Injectable()
export class MetricCollectorService extends AbstractMetricCollectorService {
  constructor(protected storageEntityRepository: StorageEntityRepository,
              protected metricRepositoryFactory: MetricRepositoryFactory) {
    super(storageEntityRepository, metricRepositoryFactory);
  }

  protected async mapData(repository, metricRequest, storageEntity) {
    const metricEntity = await this.createMetricEntity(repository, metricRequest, storageEntity);
    metricEntity.date = metricRequest.date;
    metricEntity.value = metricRequest.value;
    metricEntity.idType = metricRequest.metricType;

    if (metricEntity.owner === undefined) {
      metricEntity.owner = storageEntity;
    }

    if (metricEntity instanceof SystemMetricEntity) {
      metricEntity.peak = metricRequest.peak;
    }
    return metricEntity;
  }

  protected getMatchCriteria(metricRequest: MetricRequestDto, storageEntity: StorageEntityEntity): Partial<AbstractMetricEntity> {

    return {
      date: metricRequest.date,
      idType: metricRequest.metricType,
      owner: storageEntity,
    };

  }

}
