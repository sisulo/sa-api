import { Injectable } from '@nestjs/common';
import { SystemEntity } from '../entities/system.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateComponentInterface } from './createComponentInterface';
import { ComponentKey } from '../controllers/metric.controller';
import { ComponentStatus } from '../enums/component.status';
import { StorageEntityInterface } from '../entities/storage-entity.interface';
import { PoolEntity } from '../entities/pool.entity';
import { ChaEntity } from '../entities/cha.entity';
import { HostGroupEntity } from '../entities/host-group.entity';
import { StorageEntityNotFoundError } from './errors/storage-entity-not-found.error';

@Injectable()
export class SystemService implements CreateComponentInterface<SystemEntity, null> {

  constructor(
    @InjectRepository(SystemEntity)
    private readonly repository: Repository<SystemEntity>,
  ) {
  }

  async findById(idParam: number): Promise<SystemEntity> {
    return await this.repository
      .findOne({ id: idParam });
  }

  async findByName(systemName: string): Promise<SystemEntity> {
    return await this.repository
      .findOne({ name: systemName });
  }

  async create(systemName: string, parent?: any): Promise<SystemEntity> {
    const system = new SystemEntity();
    system.name = systemName;
    system.parentId = 1; // Todo this is temporary

    return await this.repository.save(system);
  }

  public async availableSystems(): Promise<SystemEntity[]> {
    return this.repository.createQueryBuilder('system')
      .innerJoinAndSelect('system.pools', 'pools')
      .innerJoin('block_size_latency', 'latency', 'pools.id=latency.id_pool')
      .getMany();
  }

  public async changeStatusByName(key: ComponentKey, status: ComponentStatus): Promise<SystemEntity> {
    const systemEntity = await this.findByName(key.childName);
    if (systemEntity === undefined) {
      throw new StorageEntityNotFoundError(`System ${key.childName} not found.`);
    }
    const intStatus = parseInt(ComponentStatus[status], 10) || null;

    systemEntity.pools = this.changeStatusOnChildren(systemEntity.pools, intStatus) as PoolEntity[];
    systemEntity.adapters = this.changeStatusOnChildren(systemEntity.adapters, intStatus) as ChaEntity[];
    systemEntity.hostGroups = this.changeStatusOnChildren(systemEntity.hostGroups, intStatus) as HostGroupEntity[];

    systemEntity.idCatComponentStatus = intStatus;
    return await this.repository.save(systemEntity);
  }

  private changeStatusOnChildren(entities: StorageEntityInterface[], intStatus: number): StorageEntityInterface[] {
    if (entities !== undefined) {
      return entities.map(pool => {
        pool.idCatComponentStatus = intStatus;
        return pool;
      });
    }
    return undefined;
  }
}
