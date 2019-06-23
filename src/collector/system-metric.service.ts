import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemMetricEntity } from './entities/system-metric.entity';
import { SystemMetricRequestDto } from './dto/system-metric-request.dto';
import { CatMetricTypeEntity } from './entities/cat-metric-type.entity';
import { SystemEntity } from './entities/system.entity';
import { SystemService } from './system.service';

@Injectable()
export class SystemMetricService {

  constructor(
    @InjectRepository(SystemMetricEntity)
    private readonly systemMetricRepository: Repository<SystemMetricEntity>,
    @InjectRepository(CatMetricTypeEntity) // Todo inject service instead of repository
    private readonly catMetricTypeRepository: Repository<CatMetricTypeEntity>,
    private readonly systemService: SystemService,
  ) {
  }

  async upsert(idSystem: number, systemMetric: SystemMetricRequestDto): Promise<SystemMetricEntity> {

    await this.validateSystem(idSystem);

    const metricTypeDao: CatMetricTypeEntity = await this.resolveMetricType(systemMetric.metricType);

    const metricDao: SystemMetricEntity = await this.createMetric(idSystem, metricTypeDao, systemMetric.date);

    metricDao.value = systemMetric.value;
    metricDao.idSystem = idSystem;
    metricDao.peak = systemMetric.peak;
    metricDao.date = systemMetric.date;
    metricDao.idMetricType = metricTypeDao.idCatMetricType;

    const value = await this.systemMetricRepository.save(metricDao);
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

  private async createMetric(idSystemSearch: number, idMetricType: CatMetricTypeEntity, dateSearch): Promise<SystemMetricEntity> {
    const metricDao = await this.systemMetricRepository
      .findOne({ idSystem: idSystemSearch, idMetricType: idMetricType.idCatMetricType, date: dateSearch })
      .then(dao => dao);

    if (metricDao === undefined) {
      return new SystemMetricEntity();
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
