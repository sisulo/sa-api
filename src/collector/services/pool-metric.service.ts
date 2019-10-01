import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
import { PoolMetricEntity } from '../entities/pool-metric.entity';
import { PoolEntity } from '../entities/pool.entity';
import { SystemService } from './system.service';
import { PoolService } from './pool.service';
import { CommonMetricService } from './common-metric.service';
import { MetricTypeService } from './metric-type.service';
import { CatMetricTypeEntity } from '../entities/cat-metric-type.entity';
import { MetricRequestDto } from '../dto/metric-request.dto';
import { MetricType } from '../enums/metric-type.enum';
import { PoolMetricReadEntity } from '../entities/pool-metric-read.entity';

@Injectable()
export class PoolMetricService extends CommonMetricService<PoolMetricEntity, PoolEntity> {

  constructor(
    @InjectRepository(PoolMetricEntity)
    private readonly metricRepository: Repository<PoolMetricEntity>,
    @InjectRepository(PoolMetricReadEntity)
    private readonly metricReadRepository: Repository<PoolMetricReadEntity>,
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

  public async getAlerts(): Promise<PoolMetricEntity[]> {
    const types = await this.metricTypeService.findByMetricTypes([MetricType.SLA_EVENTS, MetricType.PHYSICAL_USED_PERC]);
    return await this.metricReadRepository.createQueryBuilder('metric')
      .innerJoinAndSelect('metric.metricTypeEntity', 'type')
      .innerJoinAndSelect('type.threshold', 'threshold')
      .innerJoinAndSelect('metric.pool', 'pool')
      .innerJoinAndSelect('pool.system', 'system')
      .where('metric.value >= COALESCE(threshold.min_value, -2147483648)')
      .andWhere('metric.value < COALESCE(threshold.max_value, 2147483647)')
      .andWhere('metric.metricTypeEntity IN (:...type)', { type: types.map(type => type.idCatMetricType) })
      .getMany();
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
