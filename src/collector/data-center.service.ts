import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataCenterEntity } from './entities/data-center.entity';
import { MetricType } from './enums/metric-type.enum';

@Injectable()
export class DataCenterService {

  constructor(
    @InjectRepository(DataCenterEntity)
    private readonly dataCenterRepository: Repository<DataCenterEntity>,
  ) {
  }

  async getPerformanceMetrics(idDataCenterParam: number, dateParam: Date): Promise<DataCenterEntity> {

    return await this.dataCenterRepository.createQueryBuilder('datacenter')
      .leftJoinAndSelect('datacenter.systems', 'system')
      .leftJoinAndSelect('system.metrics', 'metrics')
      .leftJoinAndSelect('metrics.metricTypeEntity', 'type')
      .where('datacenter.id_datacenter = :idDatacenter', { idDatacenter: idDataCenterParam })
      .andWhere('metrics.date = \'2019-06-18\'', { date: dateParam }) // Todo use param for date
      .andWhere(
        'type.id_cat_metric_type IN (:...types)',
        {
          types: [
            MetricType.WORKLOAD,
            MetricType.RESPONSE,
            MetricType.CPU_PERC,
            MetricType.HDD_PERC,
            MetricType.WRITE_PENDING_PERC,
            MetricType.TRANSFER,
          ],
        })
      .getOne();
  }

  async getCapacityMetrics(idDataCenterParam: number, dateParam: Date): Promise<DataCenterEntity> {

    return await this.dataCenterRepository.createQueryBuilder('datacenter')
      .leftJoinAndSelect('datacenter.systems', 'system')
      .leftJoinAndSelect('system.pools', 'pool')
      .leftJoinAndSelect('pool.metrics', 'metrics')
      .leftJoinAndSelect('metrics.metricTypeEntity', 'type')
      .where('datacenter.id_datacenter = :idDatacenter', { idDatacenter: idDataCenterParam })
      .andWhere('metrics.date = \'2019-06-18\'', { date: dateParam }) // Todo use param for date
      .andWhere(
        'type.id_cat_metric_type IN (:...types)',
        {
          types: [
            MetricType.PHYSICAL_CAPACITY,
            MetricType.PHYSICAL_SUBS_PERC,
            MetricType.AVAILABLE_CAPACITY,
            MetricType.LOGICAL_USED_PERC,
            MetricType.PHYSICAL_USED_PERC,
            MetricType.COMPRESSION_RATIO,
            MetricType.PREDICTION_L1,
            MetricType.PREDICTION_L2,
            MetricType.PREDICTION_L3,
            MetricType.CHANGE_DAY,
            MetricType.CHANGE_WEEK,
            MetricType.CHANGE_MONTH,
            MetricType.PHYSICAL_USED,
            MetricType.PHYSICAL_FREE,
            MetricType.LOGICAL_CAPACITY,
            MetricType.LOGICAL_USED,
            MetricType.LOGICAL_USED_PERC,
            MetricType.NET_TOTAL,
            MetricType.NET_FREE,
            MetricType.NET_USED,
            MetricType.PHY_USED_BEF_SAVING,
            MetricType.DEDUP_RATIO,
            MetricType.TOTAL_SAVING_EFFECT,
          ],
        })
      .getOne();
  }

  async getChannelAdapterMetrics(idDataCenterParam: number, dateParam: Date): Promise<DataCenterEntity> {

    return await this.dataCenterRepository.createQueryBuilder('datacenter')
      .leftJoinAndSelect('datacenter.systems', 'system')
      .leftJoinAndSelect('system.adapters', 'adapter')
      .leftJoinAndSelect('adapter.metrics', 'metrics')
      .leftJoinAndSelect('metrics.metricTypeEntity', 'type')
      .where('datacenter.id_datacenter = :idDatacenter', { idDatacenter: idDataCenterParam })
      .andWhere('metrics.date = \'2019-06-18\'', { date: dateParam }) // Todo use param for date
      .andWhere(
        'type.id_cat_metric_type IN (:...types)',
        {
          types: [
            MetricType.DISBALANCE_EVENTS,
            MetricType.DISBALANCE_ABSOLUT,
            MetricType.DISBALANCE_PERC,
          ],
        })
      .getOne();
  }
}
