import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PoolEntity } from './entities/pool.entity';
import { Repository } from 'typeorm';
import { ChaEntity } from './entities/cha.entity';

@Injectable()
export class ChaService {

  constructor(
    @InjectRepository(ChaEntity)
    private readonly repository: Repository<ChaEntity>,
  ) {
  }

  public async findById(idSystemParam: number, idChaParam: number): Promise<ChaEntity> {
    const dao = await this.repository
      .findOne({ idSystem: idSystemParam, idCha: idChaParam })
      .then(metricType => metricType);

    return dao;
  }
}
