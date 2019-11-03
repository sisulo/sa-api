import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemMetricEntity } from '../entities/system-metric.entity';
import { SystemMetricRequestDto } from '../dto/system-metric-request.dto';
import { SystemEntity } from '../entities/system.entity';
import { SystemService } from './system.service';
import { CatMetricTypeEntity } from '../entities/cat-metric-type.entity';
import { CommonMetricService } from './common-metric.service';
import { MetricTypeService } from './metric-type.service';
import { MetricRequestDto } from '../dto/metric-request.dto';
import { MetricType } from '../enums/metric-type.enum';
import { SystemMetricReadEntity } from '../entities/system-metric-read.entity';
import { MetricEntityInterface } from '../entities/metric-entity.interface';
import { SystemMetricType } from '../../statistics/models/metrics/SystemMetricType';

@Injectable()
export class SystemMetricService extends CommonMetricService<SystemMetricEntity, SystemEntity> {

  constructor(
    @InjectRepository(SystemMetricEntity)
    private readonly metricRepository: Repository<SystemMetricEntity>,
    @InjectRepository(SystemMetricReadEntity)
    private readonly metricReadRepository: Repository<SystemMetricReadEntity>,
    private readonly systemService: SystemService,
    private readonly metricTypeService: MetricTypeService,
  ) {
    super(metricTypeService, null, systemService);
  }

  async save(component: SystemEntity, metricType: CatMetricTypeEntity, request: MetricRequestDto): Promise<any> {
    const entity = await this.createMetricEntity(component, metricType, request.date);
    const systemRequest = request as SystemMetricRequestDto;
    entity.value = systemRequest.value;
    entity.date = systemRequest.date;
    entity.peak = systemRequest.peak;
    entity.metricTypeEntity = metricType;
    if (entity.system == null) {
      entity.system = component;
    }
    const returnedEntity = await this.metricRepository.save(entity);

    return returnedEntity;
  }

  async getMetricGraph(type: MetricType): Promise<any[]> {
    const types = await this.metricTypeService.findByMetricTypes([type]);
    const data = await this.metricRepository.createQueryBuilder('metrics')
      .select('metrics.date', 'date')
      .addSelect('SUM(metrics.value)', 'value')
      .where('metrics.metricTypeEntity IN (:...idType)', { idType: types.map(typeObj => typeObj.idCatMetricType) })
      .groupBy('metrics.date')
      .orderBy('metrics.date')
      .getRawMany();
    return data;
  }

  // TODO this could be as generic parametrized
  public async getAlerts() {
    const types = await this.metricTypeService.findByMetricTypes([
      MetricType.CPU_PERC,
      MetricType.HDD_PERC,
      MetricType.RESPONSE,
      MetricType.WRITE_PENDING_PERC,
    ]);
    return await this.metricReadRepository.createQueryBuilder('metric')
      .innerJoinAndSelect('metric.metricTypeEntity', 'type')
      .innerJoinAndSelect('type.threshold', 'threshold')
      .innerJoinAndSelect('metric.system', 'system')
      .where('metric.value >= COALESCE(threshold.min_value, -2147483648)')
      .andWhere('metric.value < COALESCE(threshold.max_value, 2147483647)')
      .andWhere('metric.metricTypeEntity IN (:...type)', { type: types.map(type => type.idCatMetricType) })
      .getMany();
  }

  public async getGraphData(): Promise<any[]> {
    return this.metricRepository.createQueryBuilder('metric')
      .select('metric.date')
      .addSelect('SUM(metric.value)', 'sum')
      .where('metric.metricTypeEntity = :idType', { idType: MetricType.TRANSFER })
      .groupBy('metric.date')
      .getRawMany();
  }

  public async getMetrics(): Promise<MetricEntityInterface[]> {
    const types = await this.metricTypeService.findByMetricTypes([MetricType.WORKLOAD, MetricType.TRANSFER]);
    const result = [];
    for (const type of types) {
      const entities = await this.metricReadRepository.find({ metricTypeEntity: type });
      result.push(this.aggregateMetric(entities));
    }
    return result;
  }

  protected async createMetricEntity(component: SystemEntity, metricType: CatMetricTypeEntity, dateSearch: Date): Promise<SystemMetricEntity> {
    const metricDao = await this.metricRepository
      .findOne({ system: component, metricTypeEntity: metricType, date: dateSearch })
      .then(dao => dao);
    if (metricDao == null) {
      return new SystemMetricEntity();
    }
    return metricDao;
  }

  private aggregateMetric(metrics: SystemMetricReadEntity[]): MetricEntityInterface {
    const data = metrics;
    const result = new SystemMetricReadEntity();
    result.metricTypeEntity = data[0].metricTypeEntity;
    result.value = data.reduce(
      (accumulator, currentValue) => accumulator + currentValue.value, 0,
    );
    return result;
  }
}
