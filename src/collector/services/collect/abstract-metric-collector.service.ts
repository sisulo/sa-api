import { StorageEntityKey } from '../../controllers/metric.controller';
import { MetricRequestDto } from '../../dto/metric-request.dto';
import { AbstractMetricEntity } from '../../entities/abstract-metric.entity';
import { StorageEntityRepository } from '../../repositories/storage-entity.repository';
import { MetricRepositoryFactory } from '../../factory/metric-repository.factory';
import { StorageEntityEntity } from '../../entities/storage-entity.entity';
import { Repository } from 'typeorm';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import { LatencyMetricDto } from '../../dto/latency-metric.dto';

export abstract class AbstractMetricCollectorService {
  public constructor(protected storageEntityRepository: StorageEntityRepository,
                     protected metricRepositoryFactory: MetricRepositoryFactory) {
  }

  protected abstract getMatchCriteria(metricRequestDto: MetricRequestDto, storageEntity: StorageEntityEntity, multiValueData?: LatencyMetricDto);

  protected abstract mapData(repository: Repository<any>, metricRequest: MetricRequestDto, storageEntity: StorageEntityEntity, multiValueData?: LatencyMetricDto);

  public async collectMetric(componentKey: StorageEntityKey, metricRequest: MetricRequestDto) {
    const storageEntity = await this.storageEntityRepository.fetchOrCreateByStorageEntityKey(componentKey);
    const repository = this.metricRepositoryFactory.getByStorageEntityType(componentKey.child.type, metricRequest.metricType);

    let data: any[];
    if (isEmpty(metricRequest.data)) {
      data = [metricRequest];
    } else {
      data = metricRequest.data;
    }
    const entitiesToSave = await Promise.all(data.map(
      async item => await this.mapData(repository, metricRequest, storageEntity, item),
    ));
    return await repository.save(entitiesToSave);
  }

  protected async createMetricEntity(repository: Repository<AbstractMetricEntity>, metricRequest: MetricRequestDto, storageEntity: StorageEntityEntity, multiValueData?: LatencyMetricDto): Promise<AbstractMetricEntity> {

    const criteria = this.getMatchCriteria(metricRequest, storageEntity, multiValueData);

    const metricEntity = await repository.findOne({ where: criteria });

    if (metricEntity === undefined) {
      return repository.create();
    }
    return metricEntity;
  }
}