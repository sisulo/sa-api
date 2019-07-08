import { Injectable } from '@nestjs/common';
import { SystemEntity } from './entities/system.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SystemService {

  constructor(
    @InjectRepository(SystemEntity)
    private readonly repository: Repository<SystemEntity>,
  ) {
  }

  async findById(id: number): Promise<SystemEntity> {
    const dao = await this.repository
      .findOne({ idSystem: id })
      .then(metricType => metricType);

    return dao;
  }

  async getSystemsByIdDataCenter(idDataCenterParam: number, dateParam: Date): Promise<SystemEntity[]> {
    const metricsDao = await this.repository.createQueryBuilder('system')
      .innerJoinAndSelect('system.metrics', 'metrics')
      .innerJoinAndSelect('system.datacenter', 'datacenter')
      .innerJoinAndSelect('metrics.metricTypeEntity', 'type')
      .where('datacenter.id_datacenter = :idDatacenter', { idDatacenter: idDataCenterParam })
      .andWhere('metrics.date = \'2019-01-06\'', {date: dateParam})
      .getMany()
    ;
    return metricsDao;
  }
}
