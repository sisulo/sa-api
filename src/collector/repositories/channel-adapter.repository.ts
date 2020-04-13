import { EntityRepository } from 'typeorm';
import { ChaEntity } from '../entities/cha.entity';
import { AbstractCustomRepository } from './abstract-custom.repository';
import { SystemRepository } from './system.repository';

@EntityRepository(ChaEntity)
export class ChannelAdapterRepository extends AbstractCustomRepository<ChaEntity, SystemRepository> {
  constructor() {
    super(SystemRepository);
  }
}
