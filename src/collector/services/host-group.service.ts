import { Injectable } from '@nestjs/common';
import { HostGroupEntity } from '../entities/host-group.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateComponentInterface } from './createComponentInterface';
import { ComponentService } from './component.service';
import { SystemEntity } from '../entities/system.entity';

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
      .leftJoinAndSelect('hostgroup.system', 'system')
      .leftJoinAndSelect('hostgroup.externals', 'external')
      .where('hostgroup.name=:systemName', { systemName: childName })
      .andWhere('system.name=:name', { name: parentName })
      .getOne();
  }
}
