import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemService } from './system.service';
import { CommonMetricService } from './common-metric.service';
import { MetricTypeService } from './metric-type.service';
import { CatMetricTypeEntity } from '../entities/cat-metric-type.entity';
import { MetricRequestDto } from '../dto/metric-request.dto';
import { PortMetricEntity } from '../entities/port-metric.entity';
import { PortEntity } from '../entities/port.entity';
import { PortMetricReadEntity } from '../entities/port-metric-read.entity';
import { PortService } from './port.service';
import { ChaService } from './cha.service';
import { ChaEntity } from '../entities/cha.entity';
import { SystemEntity } from '../entities/system.entity';

@Injectable()
export class PortMetricService extends CommonMetricService<PortMetricEntity, PortEntity, ChaEntity, SystemEntity> {

  constructor(
    @InjectRepository(PortMetricEntity)
    private readonly metricRepository: Repository<PortMetricEntity>,
    @InjectRepository(PortMetricReadEntity)
    private readonly metricReadRepository: Repository<PortMetricReadEntity>,
    private readonly portService: PortService,
    private readonly chaService: ChaService,
    private readonly systemService: SystemService,
    private readonly metricTypeService: MetricTypeService,
  ) {
    super(metricTypeService, portService, chaService, systemService);
  }

  async save(component: PortEntity, metricType: CatMetricTypeEntity, request: MetricRequestDto): Promise<any> {
    const entity = await this.createMetricEntity(component, metricType, request.date);

    entity.value = request.value;
    entity.date = request.date;
    entity.metricTypeEntity = metricType;
    if (entity.port == null) {
      entity.port = component;
    }
    return await this.metricRepository.save(entity);
  }

  // public async getAlerts(): Promise<PoolMetricEntity[]> {
  //   const types = await this.metricTypeService.findByMetricTypes([MetricType.SLA_EVENTS, MetricType.PHYSICAL_USED_PERC]);
  //   return await this.metricReadRepository.createQueryBuilder('metric')
  //     .innerJoinAndSelect('metric.metricTypeEntity', 'type')
  //     .innerJoinAndSelect('type.threshold', 'threshold')
  //     .innerJoinAndSelect('metric.pool', 'pool')
  //     .innerJoinAndSelect('pool.system', 'system')
  //     .where('metric.value >= COALESCE(threshold.min_value, -2147483648)')
  //     .andWhere('metric.value < COALESCE(threshold.max_value, 2147483647)')
  //     .andWhere('metric.metricTypeEntity IN (:...type)', { type: types.map(type => type.idCatMetricType) })
  //     .getMany();
  // }

  protected async createMetricEntity(component: PortEntity, metricType: CatMetricTypeEntity, dateSearch: Date): Promise<PortMetricEntity> {
    const metricDao = await this.metricRepository
      .findOne({ port: component, metricTypeEntity: metricType, date: dateSearch })
      .then(dao => dao);
    if (metricDao == null) {
      return new PortMetricEntity();
    }
    return metricDao;
  }

  // // TODO duplicated in system-metric.service
  // public async getMetrics(): Promise<MetricEntityInterface[]> {
  //   const types = await this.metricTypeService.findByMetricTypes([
  //     MetricType.LOGICAL_CAPACITY,
  //     MetricType.SUBSCRIBED_CAPACITY,
  //     MetricType.TOTAL_SAVING_EFFECT,
  //     MetricType.CHANGE_MONTH]);
  //   const result = [];
  //   for (const type of types) {
  //     const entities = await this.metricReadRepository.find({ metricTypeEntity: type });
  //     result.push(this.aggregateMetric(entities));
  //   }
  //   return result;
  // }

  // private aggregateMetric(metrics: PoolMetricReadEntity[]): MetricEntityInterface {
  //   const data = metrics;
  //   const result = new SystemMetricReadEntity();
  //   result.metricTypeEntity = data[0].metricTypeEntity;
  //   result.value = data.reduce(
  //     (accumulator, currentValue) => accumulator + currentValue.value, 0,
  //   );
  //   return result;
  // }
}
