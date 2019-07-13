import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemEntity } from '../entities/system.entity';
import { PoolMetricRequestDto } from '../dto/pool-metric-request.dto';
import { PoolMetricEntity } from '../entities/pool-metric.entity';
import { PoolEntity } from '../entities/pool.entity';
import { SystemService } from './system.service';
import { PoolService } from './pool.service';
import { CommonMetricService } from './common-metric.service';
import { MetricTypeService } from './metric-type.service';
import { CatMetricTypeEntity } from '../entities/cat-metric-type.entity';
import { MetricGroup } from './data-center.service';

@Injectable()
export class PoolMetricService extends CommonMetricService {

  constructor(
    @InjectRepository(PoolMetricEntity)
    private readonly poolMetricRepository: Repository<PoolMetricEntity>,
    private readonly poolService: PoolService,
    private readonly systemService: SystemService,
    private readonly metricTypeService: MetricTypeService,
  ) {
    super(metricTypeService);
  }

  async upsert(idSystem: number, idPool: number, poolMetric: PoolMetricRequestDto): Promise<PoolMetricEntity> {

    await this.validateSystem(idSystem);

    await this.validatePool(idSystem, idPool);

    const metricType = await this.loadMetricType(poolMetric.metricType);
    CommonMetricService.validateMetricType(metricType, poolMetric.metricType, MetricGroup.CAPACITY);

    const metricDao: PoolMetricEntity = await this.createMetric(idSystem, idPool, metricType, poolMetric.date);

    metricDao.value = poolMetric.value;
    metricDao.idPool = idPool;
    metricDao.date = poolMetric.date;
    metricDao.idSystem = idSystem;
    metricDao.metricTypeEntity = metricType;

    return await this.poolMetricRepository.save(metricDao);
  }

  private async createMetric(idSystemSearch: number,
                             idPoolSearch: number,
                             metricTypeSearch: CatMetricTypeEntity,
                             dateSearch): Promise<PoolMetricEntity> {
    const metricDao = await this.poolMetricRepository
      .findOne({ idPool: idPoolSearch, idSystem: idSystemSearch, metricTypeEntity: metricTypeSearch, date: dateSearch })
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
