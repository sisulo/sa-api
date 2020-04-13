import { Injectable } from '@nestjs/common';
import { StorageEntityRequestDto } from '../dto/storage-entity-request.dto';
import { StorageEntityType } from '../dto/owner.dto';
import { ArgumentError } from './errors/argument.error';
import { ErrorCodeConst } from '../../errors/error-code.enum';
import { StorageEntityAlreadyExistsError } from './errors/storage-entity-already-exists.error';
import { SystemEntity } from '../entities/system.entity';
import { PoolEntity } from '../entities/pool.entity';
import { StorageEntityRepository } from '../repositories/storage-entity.repository';
import { Repository } from 'typeorm';
import { StorageEntityEntity } from '../entities/storage-entity.entity';
import { ComponentStatus } from '../enums/component.status';

@Injectable()
export class StorageEntityService {

  constructor(
    private storageEntityRepository: StorageEntityRepository,
  ) {
  }

  async create(requestEntity: StorageEntityRequestDto): Promise<StorageEntityEntity> {
    const parent = await this.storageEntityRepository.findOne(requestEntity.parentId);

    if (parent === undefined) {
      throw new ArgumentError(ErrorCodeConst.ENTITY_NOT_FOUND, `Database entity with id \'${requestEntity.parentId}\' was not found`);
    }
    if (await this.isAlreadyExists(requestEntity, parent)) {
      throw new StorageEntityAlreadyExistsError(`Storage Entity \'${StorageEntityType[requestEntity.type]}\' with name \'${requestEntity.name}\'
      under parent \'${requestEntity.parentId}\' already exists.`);
    }
    const entity = this.createEntity(requestEntity, parent);

    return await this.storageEntityRepository.save(entity);
  }

  private getRepository(type: StorageEntityType): Repository<StorageEntityEntity> {
    return this.storageEntityRepository;
  }

  private async isAlreadyExists(requestEntity: StorageEntityRequestDto, parentEntity) {
    const repository = this.getRepository(requestEntity.type);
    const entity = await repository.findOne({ where: { parent: parentEntity, name: requestEntity.name } });
    return entity !== undefined;
  }

  private createEntity(requestEntity: StorageEntityRequestDto, parent: StorageEntityEntity) {

    const repository = this.getRepository(requestEntity.type);

    const entity = repository.create();
    entity.name = requestEntity.name;
    entity.parent = parent;
    entity.idType = requestEntity.type;
    entity.idCatComponentStatus = ComponentStatus.ACTIVE;

    entity.serialNumber = requestEntity.serialNumber;

    return entity;
  }
}
