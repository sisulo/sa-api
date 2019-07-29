import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemService } from './system.service';
import { ChaMetricEntity } from '../entities/cha-metric.entity';
import { ChaMetricRequestDto } from '../dto/cha-metric-request.dto';
import { ChaEntity } from '../entities/cha.entity';
import { ChaService } from './cha.service';
import { CommonMetricService } from './common-metric.service';
import { MetricTypeService } from './metric-type.service';
import { CatMetricTypeEntity } from '../entities/cat-metric-type.entity';
import { MetricGroup } from './data-center.service';

@Injectable()
export class ChaMetricService extends CommonMetricService {

  constructor(
    @InjectRepository(ChaMetricEntity)
    private readonly chaMetricRepository: Repository<ChaMetricEntity>,
    private readonly systemService: SystemService,
    private readonly chaService: ChaService,
    private readonly metricTypeService: MetricTypeService,
  ) {
    super(metricTypeService);
  }

  async upsert(idSystem: number, idCha: number, chaMetric: ChaMetricRequestDto): Promise<ChaMetricEntity> {

    const chaDao = await this.loadChannelAdapter(idSystem, idCha);

    const metricType = await this.loadMetricType(chaMetric.metricType);
    CommonMetricService.validateMetricType(metricType, chaMetric.metricType, [MetricGroup.ADAPTERS]);
    const metricDao: ChaMetricEntity = await this.createMetric(chaDao, metricType, chaMetric.date);

    metricDao.value = chaMetric.value;
    metricDao.adapter = chaDao;
    metricDao.date = chaMetric.date;
    metricDao.metricTypeEntity = metricType;

    return await this.chaMetricRepository.save(metricDao);
  }

  private async createMetric(chaSearch: ChaEntity, metricTypeSearch: CatMetricTypeEntity, dateSearch): Promise<ChaMetricEntity> {
    const metricDao = await this.chaMetricRepository
      .findOne({ adapter: chaSearch, metricTypeEntity: metricTypeSearch, date: dateSearch })
      .then(dao => dao);

    if (metricDao === undefined) {
      return new ChaMetricEntity();
    }

    return metricDao;
  }

  private async loadChannelAdapter(idSystemSearch: number, idChaSearch: number) {
    let systemDao: ChaEntity;
    systemDao = await this.chaService.findById(idSystemSearch, idChaSearch);
    if (systemDao === undefined) {
      throw new NotFoundException('Channel adapter with id \'' + idChaSearch + '\' not found in system \'' + idSystemSearch + '\'.');
    }
    return systemDao;
  }
}
