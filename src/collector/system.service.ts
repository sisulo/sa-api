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
}
