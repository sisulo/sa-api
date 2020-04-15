import { EntityRepository, Repository } from 'typeorm';
import { HostGroupEntity } from '../entities/host-group.entity';

@EntityRepository(HostGroupEntity)
export class HostGroupRepository extends Repository<HostGroupEntity> {

  public async findByName(childName: string, parentName: string): Promise<HostGroupEntity> {
    return await this.createQueryBuilder('hostgroup')
      .leftJoinAndSelect('hostgroup.parent', 'system')
      .leftJoinAndSelect('hostgroup.externals', 'external')
      .where('hostgroup.name=:systemName', { systemName: childName })
      .andWhere('system.name=:name', { name: parentName })
      .getOne();
  }
}
