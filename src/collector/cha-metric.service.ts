import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemMetricEntity } from './entities/system-metric.entity';
import { SystemMetricRequestDto } from './dto/system-metric-request.dto';
import { CatMetricTypeEntity } from './entities/cat-metric-type.entity';
import { SystemEntity } from './entities/system.entity';
import { SystemService } from './system.service';
import { ChaMetricEntity } from './entities/cha-metric.entity';
import { ChaMetricRequestDto } from './dto/cha-metric-request.dto';

@Injectable()
export class ChaMetricService {

  constructor(
    @InjectRepository(ChaMetricEntity)
    private readonly chaMetricRepository: Repository<ChaMetricEntity>,
    @InjectRepository(CatMetricTypeEntity) // Todo inject service instead of repository
    private readonly catMetricTypeRepository: Repository<CatMetricTypeEntity>,
    private readonly systemService: SystemService,
  ) {
  }

  async upsert(idSystem: number, idCha: number, systemMetric: ChaMetricRequestDto): Promise<ChaMetricEntity> {

    await this.validateSystem(idSystem);

    const metricTypeDao: CatMetricTypeEntity = await this.resolveMetricType(systemMetric.metricType);

    const metricDao: ChaMetricEntity = await this.createMetric(idSystem, metricTypeDao, systemMetric.date);

    metricDao.value = systemMetric.value;
    metricDao.idSystem = idSystem;
    metricDao.idCha = idCha; // Todo find database id for cha (idInternal, idSystem) use id here
    metricDao.date = systemMetric.date;
    metricDao.idMetricType = metricTypeDao.idCatMetricType;

    const value = await this.chaMetricRepository.save(metricDao);
    return value;
  }

  private async resolveMetricType(typeName: string): Promise<CatMetricTypeEntity> {
    const typeDao = await this.catMetricTypeRepository
      .findOne({ name: typeName })
      .then(metricType => metricType);

    if (typeDao === undefined) {
      throw new BadRequestException('Metric Type \'' + typeName + '\' not exists');
    }
    return typeDao;
  }

  private async createMetric(idSystemSearch: number, idMetricType: CatMetricTypeEntity, dateSearch): Promise<ChaMetricEntity> {
    const metricDao = await this.chaMetricRepository
      .findOne({ idSystem: idSystemSearch, idMetricType: idMetricType.idCatMetricType, date: dateSearch })
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
}
