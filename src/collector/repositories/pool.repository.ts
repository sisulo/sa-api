import { EntityRepository } from 'typeorm';
import { PoolEntity } from '../entities/pool.entity';
import { AbstractCustomRepository } from './abstract-custom.repository';
import { SystemRepository } from './system.repository';

@EntityRepository(PoolEntity)
export class PoolRepository extends AbstractCustomRepository<PoolEntity, SystemRepository> {
  constructor() {
    super(SystemRepository);
  }
}
