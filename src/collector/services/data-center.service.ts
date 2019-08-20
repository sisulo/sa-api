import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataCenterEntity } from '../entities/data-center.entity';
import { MetricType } from '../enums/metric-type.enum';

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

  async getMetricsByGroup(metricGroup: MetricGroup, idDataCenterParam: number): Promise<DataCenterEntity> {
    const dcDao = await this.loadMetrics(metricGroup, idDataCenterParam);
    return dcDao || await this.getEmptyDatacenter(idDataCenterParam);
  }

  async getPerformanceMetrics(metricTypes: MetricType[], idDataCenterParam: number): Promise<DataCenterEntity> {

    return this.dataCenterRepository.createQueryBuilder('datacenter')
      .leftJoinAndSelect('datacenter.systems', 'system')
      .leftJoinAndSelect('system.metrics', 'metrics', 'metrics.metricTypeEntity IN (:...metrics)', { metrics: metricTypes })
      .leftJoinAndSelect('metrics.metricTypeEntity', 'type')
      .where('datacenter.id_datacenter = :idDatacenter', { idDatacenter: idDataCenterParam })
      .getOne();
  }

  getPoolMetrics(metricTypes: MetricType[], idDataCenterParam: number): Promise<DataCenterEntity> {

    return this.dataCenterRepository.createQueryBuilder('datacenter')
      .leftJoinAndSelect('datacenter.systems', 'system')
      .leftJoinAndSelect('system.pools', 'pool')
      .leftJoinAndSelect('pool.metrics', 'metrics', 'metrics.metricTypeEntity IN (:...metrics)', { metrics: metricTypes })
      .leftJoinAndSelect('metrics.metricTypeEntity', 'type')
      .where('datacenter.id_datacenter = :idDatacenter', { idDatacenter: idDataCenterParam })
      .getOne();
  }

  getChannelAdapterMetrics(metricTypes: MetricType[], idDataCenterParam: number): Promise<DataCenterEntity> {

    return this.dataCenterRepository.createQueryBuilder('datacenter')
      .leftJoinAndSelect('datacenter.systems', 'system')
      .leftJoinAndSelect('system.adapters', 'adapter')
      .leftJoinAndSelect('adapter.metrics', 'metrics', 'metrics.metricTypeEntity IN (:...metrics)', { metrics: metricTypes })
      .leftJoinAndSelect('metrics.metricTypeEntity', 'type')
      .where('datacenter.id_datacenter = :idDatacenter', { idDatacenter: idDataCenterParam })
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

  private loadMetrics(metricGroup: MetricGroup, idDataCenterParam: number) {
    const types: MetricType[] = this.resolveMetricTypes(metricGroup);
    switch (metricGroup) {
      case MetricGroup.PERFORMANCE:
        return this.getPerformanceMetrics(types, idDataCenterParam);
      case MetricGroup.CAPACITY:
        return this.getPoolMetrics(types, idDataCenterParam);
      case MetricGroup.ADAPTERS:
        return this.getChannelAdapterMetrics(types, idDataCenterParam);
      case MetricGroup.SLA:
        return this.getPoolMetrics(types, idDataCenterParam);
    }
  }

  private resolveMetricTypes(metricGroup: MetricGroup): MetricType[] {
    switch (metricGroup) {
      case MetricGroup.PERFORMANCE:
        return [
          MetricType.WORKLOAD,
          MetricType.TRANSFER,
          MetricType.RESPONSE,
          MetricType.CPU_PERC,
          MetricType.HDD_PERC,
          MetricType.WRITE_PENDING_PERC,
        ];
      case MetricGroup.CAPACITY:
        return [
          MetricType.PHYSICAL_CAPACITY,
          MetricType.PHYSICAL_SUBS_PERC,
          MetricType.AVAILABLE_CAPACITY,
          MetricType.LOGICAL_USED_PERC,
          MetricType.PHYSICAL_USED_PERC,
          MetricType.COMPRESSION_RATIO,
          MetricType.CHANGE_DAY,
          MetricType.CHANGE_MONTH,
          MetricType.CHANGE_WEEK,
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
          MetricType.NET_TOTAL,
          MetricType.NET_USED,
          MetricType.NET_FREE,
          MetricType.PHY_USED_BEF_SAVING,
          MetricType.DEDUP_RATIO,
          MetricType.TOTAL_SAVING_EFFECT,
          MetricType.SUBSCRIBED_CAPACITY,
          MetricType.LOGICAL_SUBS_PERC,
          MetricType.NET_SUBS_PERC,
          MetricType.NET_USED_PERC,
        ];
      case MetricGroup.ADAPTERS:
        return [
          MetricType.DISBALANCE_EVENTS,
          MetricType.DISBALANCE_ABSOLUT,
          MetricType.DISBALANCE_PERC,
        ];
      case MetricGroup.SLA:
        return [
          MetricType.SLA_EVENTS,
          MetricType.OUT_OF_SLA_TIME,
        ];
      default:
        throw new BadRequestException(`Wrong metric group ${metricGroup} when resolving set of metric types`);
    }
  }
}
