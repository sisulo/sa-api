import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatMetricTypeEntity } from './entities/cat-metric-type.entity';
import { SystemEntity } from './entities/system.entity';
import { PoolMetricRequestDto } from './dto/pool-metric-request.dto';
import { PoolMetricEntity } from './entities/pool-metric.entity';
import { PoolEntity } from './entities/pool.entity';
import { SystemService } from './system.service';
import { PoolService } from './pool.service';

@Injectable()
export class PoolMetricService {

  constructor(
    @InjectRepository(PoolMetricEntity)
    private readonly poolMetricRepository: Repository<PoolMetricEntity>,
    @InjectRepository(CatMetricTypeEntity)
    private readonly catMetricTypeRepository: Repository<CatMetricTypeEntity>,
    private readonly poolService: PoolService,
    private readonly systemService: SystemService,
  ) {
  }

  async upsert(idSystem: number, idPool: number, poolMetric: PoolMetricRequestDto): Promise<PoolMetricEntity> {

    await this.validateSystem(idSystem);

    await this.validatePool(idSystem, idPool);

    const metricTypeDao: CatMetricTypeEntity = await this.resolveMetricType(poolMetric.metricType);

    const metricDao: PoolMetricEntity = await this.createMetric(idSystem, idPool, metricTypeDao, poolMetric.date);

    metricDao.value = poolMetric.value;
    metricDao.idPool = idPool;
    metricDao.date = poolMetric.date;
    metricDao.idSystem = idSystem;
    metricDao.idMetricType = metricTypeDao.idCatMetricType;

    const value = await this.poolMetricRepository.save(metricDao);

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

  private async createMetric(idSystemSearch: number, idPoolSearch: number, idMetricType: CatMetricTypeEntity, dateSearch): Promise<PoolMetricEntity> {
    const metricDao = await this.poolMetricRepository
      .findOne({ idPool: idPoolSearch, idSystem: idSystemSearch, idMetricType: idMetricType.idCatMetricType, date: dateSearch })
      .then(dao => dao);

    if (metricDao === undefined) {
      return new PoolMetricEntity();
    }

    return metricDao;
  }

  private async validateSystem(idSystem: number) {
    const systemDao: SystemEntity = await this.systemService
      .findById(idSystem)
      .then(dao => dao);
    if (systemDao === undefined) {
      throw new NotFoundException('System with id \'' + idSystem + '\' not found');
    }
  }

  private async validatePool(idSystemSearch: number, idPoolSearch: number) {
    let systemDao: PoolEntity;
    systemDao = await this.poolService.findById(idSystemSearch, idPoolSearch);
    if (systemDao === undefined) {
      throw new NotFoundException('Pool with id \'' + idPoolSearch + '\' not found');
    }
  }
}
