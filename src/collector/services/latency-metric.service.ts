import { Injectable } from '@nestjs/common';
import { CommonMetricService } from './common-metric.service';
import { SystemEntity } from '../entities/system.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetricTypeService } from './metric-type.service';
import { SystemService } from './system.service';
import { CatMetricTypeEntity } from '../entities/cat-metric-type.entity';
import { MetricRequestDto } from '../dto/metric-request.dto';
import { PoolEntity } from '../entities/pool.entity';
import { PoolService } from './pool.service';
import { LatencyEntity } from '../entities/latency.entity';
import { OperationService } from './operation.service';
import { CatOperationEntity } from '../entities/cat-operation.entity';
import { LatencyRequestDto } from '../dto/latency-request.dto';
import { OperationType } from '../enums/operation-type.enum';
import { isEmpty } from '@nestjs/common/utils/shared.utils';

export interface LatencyData {
  blockSize: number;
  latency: number;
  count: number;
  operation: number;
}

@Injectable()
export class LatencyMetricService extends CommonMetricService<LatencyEntity, PoolEntity, SystemEntity, null> {
  constructor(
    @InjectRepository(LatencyEntity)
    private metricRepository: Repository<LatencyEntity>,
    private metricTypeService: MetricTypeService,
    protected childComponentService: PoolService,
    protected parentComponentService: SystemService,
    protected operationService: OperationService,
  ) {
    super(metricTypeService, childComponentService, parentComponentService, null, metricRepository, LatencyEntity);
  }

  async save(component: PoolEntity, metricType: CatMetricTypeEntity, request: MetricRequestDto): Promise<any> {
    const operation = await this.operationService.findById(parseInt(OperationType[request.operation], 10) || null);
    return Promise.all(request.data.map(async latencyItem => {

      const entity = await this.createLatency(component, metricType, operation, request.date, latencyItem);

      entity.date = request.date;
      entity.latency = latencyItem.latency;
      entity.blockSize = latencyItem.blockSize;
      entity.value = latencyItem.count;
      entity.operationEntity = operation;
      entity.metricTypeEntity = metricType;
      if (entity.owner == null) {
        entity.owner = component;
      }
      return await this.metricRepository.save(entity);
    }));
  }

  public async frequencyByLatencyBlockSize(poolIds: number[], datesIn: Date[], operationsIn: OperationType[]): Promise<LatencyData[]> {
    const query = this.metricRepository.createQueryBuilder('metric')
      .select('metric.blockSize', 'blockSize')
      .addSelect('metric.latency', 'latency')
      .addSelect('operation.id', 'operation')
      .addSelect('CAST(SUM(metric.value) as BIGINT)', 'count')
      .innerJoin('metric.owner', 'pool')
      .innerJoin('metric.operationEntity', 'operation')
      .groupBy('metric.latency')
      .addGroupBy('metric.blockSize')
      .addGroupBy('operation.id');
    if (!isEmpty(poolIds)) {
      query.where('pool.id IN (:...ids)', { ids: poolIds });
    }
    if (!isEmpty(datesIn)) {
      query.andWhere('metric.date IN (:...dates)', { dates: datesIn });
    }
    if (!isEmpty(operationsIn)) {
      query.andWhere('operation.name IN (:...operations)', { operations: operationsIn.map(operation => OperationType[operation]) });
    }
    return query.getRawMany();
  }

  // TODO maybe use await async in all "manager" methods when fetching
  public async availableDates(): Promise<string[]> {
    const entities = await this.metricRepository.createQueryBuilder('metric')
      .select('CAST(metric.date AS VARCHAR)', 'date')
      .groupBy('metric.date')
      .getRawMany();
    return entities.map(entity => entity.date);
  }

  protected async createLatency(component: PoolEntity,
                                metricType: CatMetricTypeEntity,
                                operation: CatOperationEntity,
                                searchDate: Date,
                                request: LatencyRequestDto): Promise<LatencyEntity> {
    const metricDao = await this.metricRepository
      .findOne({
        owner: component,
        metricTypeEntity: metricType,
        date: searchDate,
        operationEntity: operation,
        blockSize: request.blockSize,
        latency: request.latency,
      })
      .then(dao => dao);
    if (metricDao == null) {
      return new LatencyEntity();
    }
    return metricDao;
  }
}
