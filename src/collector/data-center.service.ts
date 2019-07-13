import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataCenterEntity } from './entities/data-center.entity';
import { MetricType } from './enums/metric-type.enum';

export enum MetricGroup {
  CAPACITY,
  PERFORMANCE,
  ADAPTERS,
  SLA,
}

@Injectable()
export class DataCenterService {

  constructor(
    @InjectRepository(DataCenterEntity)
    private readonly dataCenterRepository: Repository<DataCenterEntity>,
  ) {
  }

  async findById(idDataCenter: number): Promise<DataCenterEntity> {
    return await this.dataCenterRepository.findOne(idDataCenter);
  }

  async getMetricsByGroup(metricGroup: MetricGroup, idDataCenterParam: number, dateParam: Date): Promise<DataCenterEntity> {
    const dcDao = await this.loadMetrics(metricGroup, idDataCenterParam, dateParam);
    return dcDao || await this.getEmptyDatacenter(idDataCenterParam);
  }

  getPerformanceMetrics(idDataCenterParam: number, dateParam: Date): Promise<DataCenterEntity> {

    return this.dataCenterRepository.createQueryBuilder('datacenter')
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

  getCapacityMetrics(idDataCenterParam: number, dateParam: Date): Promise<DataCenterEntity> {

    return this.dataCenterRepository.createQueryBuilder('datacenter')
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
            MetricType.LOGICAL_FREE,
            MetricType.SLA_EVENTS, // maybe make a new call
            MetricType.OUT_OF_SLA_TIME, // maybe make a new call
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

  getChannelAdapterMetrics(idDataCenterParam: number, dateParam: Date): Promise<DataCenterEntity> {

    return this.dataCenterRepository.createQueryBuilder('datacenter')
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

  getEmptyDatacenter(idDataCenterParam: number): Promise<DataCenterEntity> {
    return this.findById(idDataCenterParam).then(dao => dao);
  }

  private loadMetrics(metricGroup: MetricGroup, idDataCenterParam: number, dateParam: Date) {
    switch (metricGroup) {
      case MetricGroup.PERFORMANCE:
        return this.getPerformanceMetrics(idDataCenterParam, dateParam);
      case MetricGroup.CAPACITY:
        return this.getCapacityMetrics(idDataCenterParam, dateParam);
      case MetricGroup.ADAPTERS:
        return this.getChannelAdapterMetrics(idDataCenterParam, dateParam);
      case MetricGroup.SLA:
        return this.getCapacityMetrics(idDataCenterParam, dateParam);
    }
  }
}
