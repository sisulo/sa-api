import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HostGroupMetricEntity } from '../entities/host-group-metric.entity';
import { Repository } from 'typeorm';
import { CatMetricTypeEntity } from '../entities/cat-metric-type.entity';
import { MetricTypeService } from './metric-type.service';
import { HostGroupService } from './host-group.service';
import { HostGroupEntity } from '../entities/host-group.entity';
import { SystemService } from './system.service';
import { MetricRequestDto } from '../dto/metric-request.dto';
import { CommonMetricService } from './common-metric.service';
import { SystemEntity } from '../entities/system.entity';

@Injectable()
export class HostGroupMetricService extends CommonMetricService<HostGroupMetricEntity, HostGroupEntity, SystemEntity, null> {
  constructor(
    @InjectRepository(HostGroupMetricEntity)
    private metricRepository: Repository<HostGroupMetricEntity>,
    private metricTypeService: MetricTypeService,
    protected childComponentService: HostGroupService,
    protected parentComponentService: SystemService,
  ) {
    super(metricTypeService, childComponentService, parentComponentService, null, metricRepository, HostGroupMetricEntity);
  }

  async save(component: HostGroupEntity, metricType: CatMetricTypeEntity, request: MetricRequestDto): Promise<any> {
    const entity = await this.createMetricEntity(component, metricType, request.date);

    entity.value = request.value;
    entity.date = request.date;
    entity.metricTypeEntity = metricType;
    if (entity.owner == null) {
      // entity.owner = component;
    }
    return await this.metricRepository.save(entity);
  }
}
