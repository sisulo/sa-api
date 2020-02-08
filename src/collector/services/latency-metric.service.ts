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
    super(metricTypeService, childComponentService, parentComponentService, null);
  }

  async save(component: PoolEntity, metricType: CatMetricTypeEntity, request: MetricRequestDto): Promise<any> {
    const operation = await this.operationService.findById(parseInt(OperationType[request.operation], 10) || null);
    return Promise.all(request.data.map(async latencyItem => {

      const entity = await this.createMetricEntity(component, metricType, operation, request.date, latencyItem);

      entity.date = request.date;
      entity.latency = latencyItem.latency;
      entity.blockSize = latencyItem.blockSize;
      entity.count = latencyItem.count;
      entity.operationEntity = operation;
      entity.metricTypeEntity = metricType;
      if (entity.pool == null) {
        entity.pool = component;
      }
      return await this.metricRepository.save(entity);
    }));
  }

  protected async createMetricEntity(component: PoolEntity, metricType: CatMetricTypeEntity, operation: CatOperationEntity, searchDate: Date, request: LatencyRequestDto): Promise<LatencyEntity> {
    const metricDao = await this.metricRepository
      .findOne({
        pool: component,
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
