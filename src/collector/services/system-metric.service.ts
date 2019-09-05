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

@Injectable()
export class SystemMetricService extends CommonMetricService<SystemMetricEntity, SystemEntity> {

  constructor(
    @InjectRepository(SystemMetricEntity)
    private readonly metricRepository: Repository<SystemMetricEntity>,
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

  protected async createMetricEntity(component: SystemEntity, metricType: CatMetricTypeEntity, dateSearch: Date): Promise<SystemMetricEntity> {
    const metricDao = await this.metricRepository
      .findOne({ system: component, metricTypeEntity: metricType, date: dateSearch })
      .then(dao => dao);
    if (metricDao == null) {
      return new SystemMetricEntity();
    }
    return metricDao;
  }
}
