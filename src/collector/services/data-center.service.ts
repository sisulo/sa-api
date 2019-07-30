import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataCenterEntity } from '../entities/data-center.entity';

export enum MetricGroup {
  PERFORMANCE = 1,
  CAPACITY = 2,
  ADAPTERS = 3,
  SLA = 4,
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
    const date = await this.resolveDate(dateParam, metricGroup);
    const dcDao = await this.loadMetrics(metricGroup, idDataCenterParam, date);
    return dcDao || await this.getEmptyDatacenter(idDataCenterParam);
  }

  async getPerformanceMetrics(idDataCenterParam: number, dateParam: Date): Promise<DataCenterEntity> {

    return this.dataCenterRepository.createQueryBuilder('datacenter')
      .leftJoinAndSelect('datacenter.systems', 'system')
      .leftJoinAndSelect('system.metrics', 'metrics')
      .leftJoinAndSelect('metrics.metricTypeEntity', 'type')
      .where('datacenter.id_datacenter = :idDatacenter', { idDatacenter: idDataCenterParam })
      // .andWhere('metrics.date = :date', { date: dateParam })
      .andWhere('type.id_cat_metric_group = :idGroup', { idGroup: MetricGroup.PERFORMANCE })
      .getOne();
  }

  getCapacityMetrics(idDataCenterParam: number, dateParam: Date): Promise<DataCenterEntity> {

    return this.dataCenterRepository.createQueryBuilder('datacenter')
      .leftJoinAndSelect('datacenter.systems', 'system')
      .leftJoinAndSelect('system.pools', 'pool')
      .leftJoinAndSelect('pool.metrics', 'metrics')
      .leftJoinAndSelect('metrics.metricTypeEntity', 'type')
      .where('datacenter.id_datacenter = :idDatacenter', { idDatacenter: idDataCenterParam })
      // .andWhere('metrics.date = :date', { date: dateParam })
      .andWhere('type.id_cat_metric_group = :idGroup', { idGroup: MetricGroup.CAPACITY })
      .getOne();
  }

  getChannelAdapterMetrics(idDataCenterParam: number, dateParam: Date): Promise<DataCenterEntity> {

    return this.dataCenterRepository.createQueryBuilder('datacenter')
      .leftJoinAndSelect('datacenter.systems', 'system')
      .leftJoinAndSelect('system.adapters', 'adapter')
      .leftJoinAndSelect('adapter.metrics', 'metrics')
      .leftJoinAndSelect('metrics.metricTypeEntity', 'type')
      .where('datacenter.id_datacenter = :idDatacenter', { idDatacenter: idDataCenterParam })
      // .andWhere('metrics.date = :date', { date: dateParam })
      .andWhere('type.id_cat_metric_group = :idGroup', { idGroup: MetricGroup.ADAPTERS })
      .getOne();
  }

  getEmptyDatacenter(idDataCenterParam: number): Promise<DataCenterEntity> {
    return this.findById(idDataCenterParam).then(dao => dao);
  }

  getAllDataCenters(): Promise<DataCenterEntity[]> {
    return this.dataCenterRepository.createQueryBuilder('datacenter')
      .innerJoinAndSelect('datacenter.systems', 'system')
      .getMany();
  }

  async fetchLastDate(table, defaultDate): Promise<Date> {
    const result = await this.dataCenterRepository.manager.query(`SELECT to_char(date, 'YYYY-MM-dd') AS date from ${table} order by date DESC LIMIT 1`);
    if (result[0] != null) {
      return result[0].date;
    }
    return defaultDate;

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

  private resolveDate(date: Date, metricGroup: MetricGroup): Promise<Date> {
    switch (metricGroup) {
      case MetricGroup.PERFORMANCE:
        return this.fetchLastDate('system_metrics', date);
      case MetricGroup.CAPACITY:
        return this.fetchLastDate('pool_metrics', date);
      case MetricGroup.ADAPTERS:
        return this.fetchLastDate('cha_metrics', date);
      case MetricGroup.SLA:
        return this.fetchLastDate('pool_metrics', date);
    }
  }
}
