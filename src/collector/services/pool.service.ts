import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PoolEntity } from '../entities/pool.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PoolService {

  constructor(
    @InjectRepository(PoolEntity)
    private readonly repository: Repository<PoolEntity>,
  ) {
  }

  public async findById(idSystemParam: number, idPoolParam: number): Promise<PoolEntity> {
    return await this.repository.createQueryBuilder('pools')
      .innerJoinAndSelect('pools.system', 'systems')
      .where('pools.id_pool=:idPool', { idPool: idPoolParam })
      .andWhere('systems.id_system=:idSystem', { idSystem: idSystemParam })
      .getOne();
  }
}
