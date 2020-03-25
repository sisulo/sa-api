import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PoolEntity } from '../entities/pool.entity';
import { Repository } from 'typeorm';
import { CreateComponentInterface } from './createComponentInterface';
import { ComponentService } from './component.service';
import { SystemEntity } from '../entities/system.entity';
import { ComponentStatus } from '../enums/component.status';
import { ComponentKey } from '../controllers/metric.controller';

@Injectable()
export class PoolService extends ComponentService<PoolEntity, SystemEntity> implements CreateComponentInterface<PoolEntity, SystemEntity> {
  constructor(
    @InjectRepository(PoolEntity)
    protected readonly repository: Repository<PoolEntity>,
  ) {
    super(repository, PoolEntity);
  }

  async findByName(childName: string, parentName: string): Promise<PoolEntity> {
    return await this.repository.createQueryBuilder('pool')
      .leftJoinAndSelect('pool.system', 'system')
      .where('pool.name=:poolName', { poolName: childName })
      .andWhere('system.name=:systemName', { systemName: parentName })
      .getOne();
  }

  public async findById(idSystemParam: number, idPoolParam: number): Promise<PoolEntity> {
    return await this.repository.createQueryBuilder('pools')
      .innerJoinAndSelect('pools.system', 'systems')
      .where('pools.id_pool=:idPool', { idPool: idPoolParam })
      .andWhere('systems.id_system=:idSystem', { idSystem: idSystemParam })
      .getOne();
  }

  public async changeStatusByName(key: ComponentKey, status: ComponentStatus): Promise<PoolEntity> {
    const pool = await this.findByName(key.childName, key.parentName);
    if (pool === undefined) {
      throw new Error('Pool ${poolName} not found in ${systemName}');
    }
    pool.idCatComponentStatus = parseInt(ComponentStatus[status], 10) || null;
    return await this.repository.save(pool);
  }
}
