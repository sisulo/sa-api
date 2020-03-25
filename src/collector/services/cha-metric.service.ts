import { Injectable } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { SystemService } from './system.service';
import { ChaMetricEntity } from '../entities/cha-metric.entity';
import { ChaEntity } from '../entities/cha.entity';
import { ChaService } from './cha.service';
import { CommonMetricService } from './common-metric.service';
import { MetricTypeService } from './metric-type.service';
import { CatMetricTypeEntity } from '../entities/cat-metric-type.entity';
import { MetricType } from '../enums/metric-type.enum';
import { ChaMetricReadEntity } from '../entities/cha-metric-read.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemEntity } from '../entities/system.entity';

@Injectable()
export class ChaMetricService extends CommonMetricService<ChaMetricEntity, ChaEntity, SystemEntity, null> {

  constructor(
    @InjectRepository(ChaMetricEntity)
    private readonly metricRepository: Repository<ChaMetricEntity>,
    @InjectRepository(ChaMetricReadEntity)
    private readonly metricReadRepository: Repository<ChaMetricReadEntity>,
    protected readonly systemService: SystemService,
    protected readonly chaService: ChaService,
    protected readonly metricTypeService: MetricTypeService,
  ) {
    super(metricTypeService, chaService, systemService, null, metricRepository, ChaMetricEntity);
  }

  async save(component: any, metricType: CatMetricTypeEntity, request: any): Promise<any> {
    const entity = await this.createMetricEntity(component, metricType, request.date);

    entity.value = request.value;
    entity.date = request.date;
    entity.metricTypeEntity = metricType;
    if (entity.owner == null) {
      entity.owner = component;
    }
    return await this.metricRepository.save(entity);
  }

  public async getAlerts(): Promise<ChaMetricEntity[]> {
    const type = await this.metricTypeService.findById(MetricType.IMBALANCE_EVENTS);
    return await this.metricReadRepository.find({ value: MoreThan(0), metricTypeEntity: type });
  }
}
