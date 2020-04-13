import { AbstractCustomRepository } from './abstract-custom.repository';
import { PortEntity } from '../entities/port.entity';
import { ChannelAdapterRepository } from './channel-adapter.repository';
import { EntityRepository } from 'typeorm';

@EntityRepository(PortEntity)
export class PortRepository extends AbstractCustomRepository<PortEntity, ChannelAdapterRepository> {
  constructor() {
    super(ChannelAdapterRepository);
  }
}
