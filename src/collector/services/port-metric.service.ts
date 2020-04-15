import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
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
import { MetricType } from '../enums/metric-type.enum';

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
    super(metricTypeService, portService, chaService, systemService, metricRepository, PortMetricEntity);
  }

  async save(component: PortEntity, metricType: CatMetricTypeEntity, request: MetricRequestDto): Promise<any> {
    const entity = await this.createMetricEntity(component, metricType, request.date);

    entity.value = request.value;
    entity.date = request.date;
    entity.metricTypeEntity = metricType;
    if (entity.owner == null) {
      // entity.owner = component;
    }
    return await this.metricRepository.save(entity);
  }

  public async getAlerts(): Promise<PortMetricReadEntity[]> {
    const type = await this.metricTypeService.findById(MetricType.PORT_IMBALANCE_EVENTS);
    return await this.metricReadRepository.find({ value: MoreThan(0), metricTypeEntity: type });
  }
}
