import { EntityRepository } from 'typeorm';
import { HostGroupEntity } from '../entities/host-group.entity';
import { AbstractCustomRepository } from './abstract-custom.repository';
import { SystemRepository } from './system.repository';

@EntityRepository(HostGroupEntity)
export class HostGroupRepository extends AbstractCustomRepository<HostGroupEntity, SystemRepository> {
  constructor() {
    super(SystemRepository);
  }
}
