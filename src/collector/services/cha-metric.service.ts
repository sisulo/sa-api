import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemService } from './system.service';
import { ChaMetricEntity } from '../entities/cha-metric.entity';
import { ChaEntity } from '../entities/cha.entity';
import { ChaService } from './cha.service';
import { CommonMetricService } from './common-metric.service';
import { MetricTypeService } from './metric-type.service';
import { CatMetricTypeEntity } from '../entities/cat-metric-type.entity';

@Injectable()
export class ChaMetricService extends CommonMetricService<ChaMetricEntity, ChaEntity> {

  constructor(
    @InjectRepository(ChaMetricEntity)
    private readonly metricRepository: Repository<ChaMetricEntity>,
    protected readonly systemService: SystemService,
    protected readonly chaService: ChaService,
    protected readonly metricTypeService: MetricTypeService,
  ) {
    super(metricTypeService, systemService, chaService);
  }

  async save(component: any, metricType: CatMetricTypeEntity, request: any): Promise<any> {
    const entity = await this.createMetricEntity(component, metricType, request.date);

    entity.value = request.value;
    entity.date = request.date;
    entity.metricTypeEntity = metricType;
    if (entity.adapter == null) {
      entity.adapter = component;
    }
    const returnedEntity = await this.metricRepository.save(entity);

    return returnedEntity;
  }

  protected async createMetricEntity(component: ChaEntity, metricType: CatMetricTypeEntity, dateSearch: Date): Promise<ChaMetricEntity> {
    const metricDao = await this.metricRepository
      .findOne({ adapter: component, metricTypeEntity: metricType, date: dateSearch })
      .then(dao => dao);
    if (metricDao == null) {
      return new ChaMetricEntity();
    }
    return metricDao;
  }
}
