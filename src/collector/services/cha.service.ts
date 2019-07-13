import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChaEntity } from '../entities/cha.entity';

@Injectable()
export class ChaService {

  constructor(
    @InjectRepository(ChaEntity)
    private readonly repository: Repository<ChaEntity>,
  ) {
  }

  public async findById(idSystemParam: number, idChaParam: number): Promise<ChaEntity> {
    return await this.repository
      .findOne({ idSystem: idSystemParam, idCha: idChaParam })
      .then(metricType => metricType);
  }
}
