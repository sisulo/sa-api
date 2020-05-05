import { MetricRequestDto } from '../../dto/metric-request.dto';
import { AbstractMetricEntity } from '../../entities/abstract-metric.entity';
import { StorageEntityRepository } from '../../repositories/storage-entity.repository';
import { MetricRepositoryFactory } from '../../factory/metric-repository.factory';
import { StorageEntityEntity } from '../../entities/storage-entity.entity';
import { Repository } from 'typeorm';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import { LatencyRequestDto } from '../../dto/latency-request.dto';
import { StorageEntityKey } from '../../utils/storage-entity-key.utils';

export interface MetricCollectorCommand {
  repository: Repository<any>;
  requestDto: MetricRequestDto;
  storageEntity: StorageEntityEntity;
  latencyMetricDto: LatencyRequestDto;
}

export abstract class AbstractMetricCollectorService {
  public constructor(protected storageEntityRepository: StorageEntityRepository,
                     protected metricRepositoryFactory: MetricRepositoryFactory) {
  }

  protected abstract getMatchCriteria(metricRequestDto: MetricRequestDto, storageEntity: StorageEntityEntity, multiValueData?: LatencyRequestDto);

  protected abstract mapData(command: MetricCollectorCommand);

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
      async item => {
        const command: MetricCollectorCommand = {
          repository,
          requestDto: metricRequest,
          storageEntity,
          latencyMetricDto: item,
        };
        return await this.mapData(command);
      },
    ));
    return await repository.save(entitiesToSave);
  }

  protected async createMetricEntity(command: MetricCollectorCommand): Promise<AbstractMetricEntity> {

    const criteria = this.getMatchCriteria(command.requestDto, command.storageEntity, command.latencyMetricDto);

    const metricEntity = await command.repository.findOne({ where: criteria });

    if (metricEntity === undefined) {
      return command.repository.create();
    }
    return metricEntity;
  }
}
