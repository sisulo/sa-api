import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    const poolDao = await this.loadPool(idSystem, idPool);

    const metricType = await this.loadMetricType(poolMetric.metricType);
    CommonMetricService.validateMetricType(metricType, poolMetric.metricType, [MetricGroup.CAPACITY, MetricGroup.SLA]);

    const metricDao: PoolMetricEntity = await this.createMetric(poolDao, metricType, poolMetric.date);

    metricDao.value = poolMetric.value;
    metricDao.pool = poolDao;
    metricDao.date = poolMetric.date;
    metricDao.metricTypeEntity = metricType;

    return await this.poolMetricRepository.save(metricDao);
  }

  private async createMetric(poolSearch: PoolEntity,
                             metricTypeSearch: CatMetricTypeEntity,
                             dateSearch): Promise<PoolMetricEntity> {
    const metricDao = await this.poolMetricRepository
      .findOne({ pool: poolSearch, metricTypeEntity: metricTypeSearch, date: dateSearch })
      .then(dao => dao);

    if (metricDao === undefined) {
      return new PoolMetricEntity();
    }

    return metricDao;
  }

  private async loadPool(idSystemSearch: number, idPoolSearch: number): Promise<PoolEntity> {
    let poolDao: PoolEntity;
    poolDao = await this.poolService.findById(idSystemSearch, idPoolSearch);
    if (poolDao === undefined) {
      throw new NotFoundException('Pool with id \'' + idPoolSearch + '\' not found');
    }
    return poolDao;
  }
}
