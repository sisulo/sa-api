import { Injectable } from '@nestjs/common';
import { AbstractMetricCollectorService } from './abstract-metric-collector.service';
import { StorageEntityEntity } from '../../entities/storage-entity.entity';
import { MetricRequestDto } from '../../dto/metric-request.dto';
import { Repository } from 'typeorm';
import { LatencyEntity } from '../../entities/latency.entity';
import { StorageEntityRepository } from '../../repositories/storage-entity.repository';
import { MetricRepositoryFactory } from '../../factory/metric-repository.factory';

@Injectable()
export class MultiValueMetricCollectorService extends AbstractMetricCollectorService {
  constructor(protected storageEntityRepository: StorageEntityRepository,
              protected metricRepositoryFactory: MetricRepositoryFactory) {
    super(storageEntityRepository, metricRepositoryFactory);
  }
  protected getMatchCriteria(metricRequestDto: MetricRequestDto, storageEntity: StorageEntityEntity, metricValueItem?) {
    return {
      owner: storageEntity,
      metricTypeEntity: metricRequestDto.metricType,
      date: metricRequestDto.date,
      operationEntity: metricRequestDto.operation,
      blockSize: metricValueItem.blockSize,
      latency: metricValueItem.latency,
    };
  }

  protected async mapData(repository: Repository<any>, metricRequest: MetricRequestDto, storageEntity: StorageEntityEntity, multiValueData?) {
    const entity = await this.createMetricEntity(repository, metricRequest, storageEntity, multiValueData) as LatencyEntity;

    entity.date = metricRequest.date;
    entity.latency = multiValueData.latency;
    entity.blockSize = multiValueData.blockSize;
    entity.value = multiValueData.count;
    entity.idOperation = metricRequest.operation;
    entity.idType = metricRequest.metricType;
    if (entity.owner == null) {
      entity.owner = storageEntity;
    }
    return entity;
  }

}