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

@Injectable()
export class HostGroupService
  extends ComponentService<HostGroupEntity, SystemEntity>
  implements CreateComponentInterface<HostGroupEntity, SystemEntity> {
  constructor(
    @InjectRepository(HostGroupEntity)
    protected repository: Repository<HostGroupEntity>) {
    super(repository, HostGroupEntity);
  }

  public async findByName(childName: string, parentName: string): Promise<HostGroupEntity> {
    return await this.repository.createQueryBuilder('hostgroup')
      .leftJoinAndSelect('hostgroup.parent', 'system')
      .leftJoinAndSelect('hostgroup.externals', 'external')
      .where('hostgroup.name=:systemName', { systemName: childName })
      .andWhere('system.name=:name', { name: parentName })
      .getOne();
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
