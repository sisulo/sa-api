import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatMetricTypeEntity } from './entities/cat-metric-type.entity';

@Injectable()
export class MetricTypeService {

  constructor(
    @InjectRepository(CatMetricTypeEntity)
    private readonly repository: Repository<CatMetricTypeEntity>,
  ) {
  }

  async findById(id: number): Promise<CatMetricTypeEntity> {
    return await this.repository
      .findOne({ idCatMetricType: id })
      .then(metricType => metricType);
  }
}
