import { EntityRepository } from 'typeorm';
import { SystemEntity } from '../entities/system.entity';
import { AbstractCustomRepository } from './abstract-custom.repository';
import { DataCenterRepository } from './data-center.repository';

@EntityRepository(SystemEntity)
export class SystemRepository extends AbstractCustomRepository<SystemEntity, DataCenterRepository> {
  constructor() {
    super(DataCenterRepository);
  }
}
