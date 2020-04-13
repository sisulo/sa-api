import { Injectable } from '@nestjs/common';
import { StorageEntityRequestDto } from '../dto/storage-entity-request.dto';
import { StorageEntityType } from '../dto/owner.dto';
import { ArgumentError } from './errors/argument.error';
import { ErrorCodeConst } from '../../errors/error-code.enum';
import { SystemRepository } from '../repositories/system.repository';
import { PoolRepository } from '../repositories/pool.repository';
import { AbstractCustomRepository } from '../repositories/abstract-custom.repository';
import { StorageEntityAlreadyExistsError } from './errors/storage-entity-already-exists.error';
import { ChannelAdapterRepository } from '../repositories/channel-adapter.repository';
import { HostGroupRepository } from '../repositories/host-group.repository';
import { PortRepository } from '../repositories/port.repository';

@Injectable()
export class StorageEntityService {

  constructor(
    private systemRepository: SystemRepository,
    private poolRepository: PoolRepository,
    private channelAdapterRepository: ChannelAdapterRepository,
    private hostGroupRepository: HostGroupRepository,
    private portRepository: PortRepository,
  ) {
  }

  async create(requestEntity: StorageEntityRequestDto) {
    const repository = this.getRepository(requestEntity.type);
    const parent = await repository.findParent(requestEntity.parentId);

    if (parent === undefined) {
      throw new ArgumentError(ErrorCodeConst.ENTITY_NOT_FOUND, `Database entity with id \'${requestEntity.parentId}\' was not found`);
    }
    if (await this.isAlreadyExists(requestEntity, parent)) {
      throw new StorageEntityAlreadyExistsError(`Storage Entity \'${StorageEntityType[requestEntity.type]}\' with name \'${requestEntity.name}\'
      under parent \'${requestEntity.parentId}\' already exists.`);
    }
    const entity = this.createEntity(requestEntity, parent);

    return repository.save(entity);
  }

  private getRepository(type: StorageEntityType): AbstractCustomRepository<any, any> {
    switch (type) {
      case StorageEntityType.SYSTEM:
        return this.systemRepository;
      case StorageEntityType.POOL:
        return this.poolRepository;
      case StorageEntityType.ADAPTER:
        return this.channelAdapterRepository;
      case StorageEntityType.HOST_GROUP:
        return this.hostGroupRepository;
      case StorageEntityType.PORT:
        return this.portRepository;
      default:
        throw new ArgumentError(ErrorCodeConst.REPOSITORY_NOT_FOUND, `Storage entity type \'${type}\' is not recognized as valid.`);
    }
  }

  private async isAlreadyExists(requestEntity: StorageEntityRequestDto, parentEntity) {
    const repository = this.getRepository(requestEntity.type);
    const entity = await repository.findOne({ where: { parent: parentEntity, name: requestEntity.name } });
    return entity !== undefined;

  }

  private createEntity(requestEntity: StorageEntityRequestDto, parent) {

    const repository = this.getRepository(requestEntity.type);

    const entity = repository.create();
    entity.name = requestEntity.name;
    entity.parent = parent;

    return entity;
  }
}
