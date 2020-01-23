import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CatOperationEntity } from '../entities/cat-operation.entity';

@Injectable()
export class OperationService {

  constructor(
    @InjectRepository(CatOperationEntity)
    private readonly repository: Repository<CatOperationEntity>,
  ) {
  }

  async findById(id: number): Promise<CatOperationEntity> {
    return await this.repository
      .findOne({ idCatOperation: id })
      .then(metricType => metricType);
  }

  async findByMetricTypes(types: number[]) {
    return await this.repository
      .find({ idCatOperation: In(types) });
  }
}
