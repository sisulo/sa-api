import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatMetricTypeEntity } from './entities/cat-metric-type.entity';
import { SystemEntity } from './entities/system.entity';
import { SystemService } from './system.service';
import { ChaMetricEntity } from './entities/cha-metric.entity';
import { ChaMetricRequestDto } from './dto/cha-metric-request.dto';
import { ChaEntity } from './entities/cha.entity';
import { ChaService } from './cha.service';
import { MetricType } from './enums/metric-type.enum';

@Injectable()
export class ChaMetricService {

  constructor(
    @InjectRepository(ChaMetricEntity)
    private readonly chaMetricRepository: Repository<ChaMetricEntity>,
    @InjectRepository(CatMetricTypeEntity) // Todo inject service instead of repository
    private readonly catMetricTypeRepository: Repository<CatMetricTypeEntity>,
    private readonly systemService: SystemService,
    private readonly chaService: ChaService,
  ) {
  }

  async upsert(idSystem: number, idCha: number, chaMetric: ChaMetricRequestDto): Promise<ChaMetricEntity> {

    await this.validateSystem(idSystem);

    await this.validateChannelAdapter(idSystem, idCha);

    const metricDao: ChaMetricEntity = await this.createMetric(idSystem, chaMetric.metricType, chaMetric.date);

    metricDao.value = chaMetric.value;
    metricDao.idSystem = idSystem;
    metricDao.idCha = idCha;
    metricDao.date = chaMetric.date;
    metricDao.idMetricType = Number(MetricType[chaMetric.metricType]);

    const value = await this.chaMetricRepository.save(metricDao);
    return value;
  }

  private async createMetric(idSystemSearch: number, metricType: MetricType, dateSearch): Promise<ChaMetricEntity> {
    const metricDao = await this.chaMetricRepository
      .findOne({ idSystem: idSystemSearch, idMetricType: Number(MetricType[metricType]), date: dateSearch })
      .then(dao => dao);

    if (metricDao === undefined) {
      return new ChaMetricEntity();
    }

    return metricDao;
  }

  private async validateSystem(idSystemSearch: number) {
    const systemDao: SystemEntity = await this.systemService
      .findById(idSystemSearch)
      .then(dao => dao);

    if (systemDao === undefined) {
      throw new NotFoundException('System with id \'' + idSystemSearch + '\' not found');
    }
  }

  private async validateChannelAdapter(idSystemSearch: number, idChaSearch: number) {
    let systemDao: ChaEntity;
    systemDao = await this.chaService.findById(idSystemSearch, idChaSearch);
    if (systemDao === undefined) {
      throw new NotFoundException('Channel adapter with id \'' + idChaSearch + '\' not found in system \'' + idSystemSearch + '\'.');
    }
  }
}
