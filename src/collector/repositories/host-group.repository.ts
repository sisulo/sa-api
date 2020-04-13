import { EntityRepository } from 'typeorm';
import { HostGroupEntity } from '../entities/host-group.entity';
import { AbstractCustomRepository } from './abstract-custom.repository';
import { SystemRepository } from './system.repository';

@EntityRepository(HostGroupEntity)
export class HostGroupRepository extends AbstractCustomRepository<HostGroupEntity, SystemRepository> {
  constructor() {
    super(SystemRepository);
  }

  public async findByName(childName: string, parentName: string): Promise<HostGroupEntity> {
    return await this.createQueryBuilder('hostgroup')
      .leftJoinAndSelect('hostgroup.parent', 'system')
      .leftJoinAndSelect('hostgroup.externals', 'external')
      .where('hostgroup.name=:systemName', { systemName: childName })
      .andWhere('system.name=:name', { name: parentName })
      .getOne();
  }
}
