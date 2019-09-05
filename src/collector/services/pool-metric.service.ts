import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PoolMetricEntity } from '../entities/pool-metric.entity';
import { PoolEntity } from '../entities/pool.entity';
import { SystemService } from './system.service';
import { PoolService } from './pool.service';
import { CommonMetricService } from './common-metric.service';
import { MetricTypeService } from './metric-type.service';
import { CatMetricTypeEntity } from '../entities/cat-metric-type.entity';
import { MetricRequestDto } from '../dto/metric-request.dto';

@Injectable()
export class PoolMetricService extends CommonMetricService<PoolMetricEntity, PoolEntity> {

  constructor(
    @InjectRepository(PoolMetricEntity)
    private readonly metricRepository: Repository<PoolMetricEntity>,
    private readonly poolService: PoolService,
    private readonly systemService: SystemService,
    private readonly metricTypeService: MetricTypeService,
  ) {
    super(metricTypeService, systemService, poolService);
  }

  async save(component: PoolEntity, metricType: CatMetricTypeEntity, request: MetricRequestDto): Promise<any> {
    const entity = await this.createMetricEntity(component, metricType, request.date);

    entity.value = request.value;
    entity.date = request.date;
    entity.metricTypeEntity = metricType;
    if (entity.pool == null) {
      entity.pool = component;
    }
    const returnedEntity = await this.metricRepository.save(entity);

    return returnedEntity;
  }

  protected async createMetricEntity(component: PoolEntity, metricType: CatMetricTypeEntity, dateSearch: Date): Promise<PoolMetricEntity> {
    const metricDao = await this.metricRepository
      .findOne({ pool: component, metricTypeEntity: metricType, date: dateSearch })
      .then(dao => dao);
    if (metricDao == null) {
      return new PoolMetricEntity();
    }
    return metricDao;
  }
}
