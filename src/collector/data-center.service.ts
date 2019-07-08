import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataCenterEntity } from './entities/data-center.entity';

@Injectable()
export class DataCenterService {

  constructor(
    @InjectRepository(DataCenterEntity)
    private readonly dataCenterRepository: Repository<DataCenterEntity>,
  ) {
  }
  async getPerformanceMetrics(idDataCenterParam: number, dateParam: Date): Promise<DataCenterEntity> {
    const metricsDao = await this.dataCenterRepository.createQueryBuilder('datacenter')
      .innerJoinAndSelect('datacenter.systems', 'system')
      .innerJoinAndSelect('system.metrics', 'metrics')
      .innerJoinAndSelect('metrics.metricTypeEntity', 'type')
      .where('datacenter.id_datacenter = :idDatacenter', { idDatacenter: idDataCenterParam })
      .andWhere('metrics.date = \'2019-01-06\'', {date: dateParam})
      .getOne()
    ;
    return metricsDao;
  }
}
