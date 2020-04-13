import { Injectable } from '@nestjs/common';
import { HostGroupEntity } from '../entities/host-group.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateComponentInterface } from './createComponentInterface';
import { ComponentService } from './component.service';
import { SystemEntity } from '../entities/system.entity';
import { ComponentKey } from '../controllers/metric.controller';
import { ComponentStatus } from '../enums/component.status';
import { StorageEntityNotFoundError } from './errors/storage-entity-not-found.error';
import { HostGroupRepository } from '../repositories/host-group.repository';

@Injectable()
export class HostGroupService
  extends ComponentService<HostGroupEntity, SystemEntity>
  implements CreateComponentInterface<HostGroupEntity, SystemEntity> {
  constructor(
    protected repository: HostGroupRepository) {
    super(repository, HostGroupEntity);
  }

  public async findByName(childName: string, parentName: string): Promise<HostGroupEntity> {
    return await this.repository.findByName(childName, parentName);
  }

  public async changeStatusByName(key: ComponentKey, status: ComponentStatus): Promise<HostGroupEntity> {
    const hostGroupEntity = await this.findByName(key.childName, key.parentName);
    if (hostGroupEntity === undefined) {
      throw new StorageEntityNotFoundError(`Host group ${key.childName} not found in ${key.parentName}`);
    }
    hostGroupEntity.idCatComponentStatus = parseInt(ComponentStatus[status], 10) || null;
    return await this.repository.save(hostGroupEntity);
  }
}
