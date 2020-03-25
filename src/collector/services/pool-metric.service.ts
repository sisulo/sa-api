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
import { MetricType } from '../enums/metric-type.enum';
import { PoolMetricReadEntity } from '../entities/pool-metric-read.entity';
import { MetricEntityInterface } from '../entities/metric-entity.interface';
import { SystemMetricReadEntity } from '../entities/system-metric-read.entity';
import { SystemEntity } from '../entities/system.entity';
import { ComponentStatus } from '../enums/component.status';

@Injectable()
export class PoolMetricService extends CommonMetricService<PoolMetricEntity, PoolEntity, SystemEntity, null> {

  constructor(
    @InjectRepository(PoolMetricEntity)
    private readonly metricRepository: Repository<PoolMetricEntity>,
    @InjectRepository(PoolMetricReadEntity)
    private readonly metricReadRepository: Repository<PoolMetricReadEntity>,
    private readonly poolService: PoolService,
    private readonly systemService: SystemService,
    private readonly metricTypeService: MetricTypeService,
  ) {
    super(metricTypeService, poolService, systemService, null, metricRepository, PoolMetricEntity);
  }

  async save(component: PoolEntity, metricType: CatMetricTypeEntity, request: MetricRequestDto): Promise<any> {
    const entity = await this.createMetricEntity(component, metricType, request.date);

    entity.value = request.value;
    entity.date = request.date;
    entity.metricTypeEntity = metricType;
    if (entity.owner == null) {
      entity.owner = component;
    }
    return await this.metricRepository.save(entity);
  }

  public async getAlerts(): Promise<PoolMetricEntity[]> {
    const types = await this.metricTypeService.findByMetricTypes([MetricType.SLA_EVENTS, MetricType.PHYSICAL_USED_PERC]);
    return await this.metricReadRepository.createQueryBuilder('metric')
      .innerJoinAndSelect('metric.metricTypeEntity', 'type')
      .innerJoinAndSelect('type.threshold', 'threshold')
      .innerJoinAndSelect('metric.owner', 'pool')
      .innerJoinAndSelect('pool.system', 'system')
      .where('metric.value >= COALESCE(threshold.min_value, -2147483648)')
      .andWhere('metric.value < COALESCE(threshold.max_value, 2147483647)')
      .andWhere('system.idCatComponentStatus = :idSystemStatus', { idSystemStatus: ComponentStatus.ACTIVE })
      .andWhere('metric.metricTypeEntity IN (:...type)', { type: types.map(type => type.idCatMetricType) })
      .getMany();
  }

  // TODO duplicated in owner-metric.service
  async getMetricGraph(type: MetricType): Promise<any[]> {
    const types = await this.metricTypeService.findByMetricTypes([type]);
    return await this.metricRepository.createQueryBuilder('metrics')
      .select('metrics.date', 'date')
      .addSelect('SUM(metrics.value)', 'value')
      .where('metrics.metricTypeEntity IN (:...idType)', { idType: types.map(typeObj => typeObj.idCatMetricType) })
      .andWhere('metrics.date < current_date')
      .groupBy('metrics.date')
      .orderBy('metrics.date')
      .getRawMany();
  }

  // TODO duplicated in owner-metric.service
  public async getMetrics(): Promise<MetricEntityInterface[]> {
    const types = await this.metricTypeService.findByMetricTypes([
      MetricType.LOGICAL_CAPACITY,
      MetricType.SUBSCRIBED_CAPACITY,
      MetricType.TOTAL_SAVING_EFFECT,
      MetricType.CHANGE_MONTH]);
    const result = [];
    for (const type of types) {
      const entities = await this.metricReadRepository.find({ metricTypeEntity: type });
      result.push(this.aggregateMetric(entities));
    }
    return result;
  }

  private aggregateMetric(metrics: PoolMetricReadEntity[]): MetricEntityInterface {
    const data = metrics;
    const result = new SystemMetricReadEntity();
    result.metricTypeEntity = data[0].metricTypeEntity;
    result.value = data.reduce(
      (accumulator, currentValue) => accumulator + currentValue.value, 0,
    );
    return result;
  }
}
