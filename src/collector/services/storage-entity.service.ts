import { Injectable } from '@nestjs/common';
import { StorageEntityRequestDto } from '../dto/storage-entity-request.dto';
import { StorageEntityType } from '../dto/owner.dto';
import { ArgumentError } from './errors/argument.error';
import { ErrorCodeConst } from '../../errors/error-code.enum';
import { StorageEntityAlreadyExistsError } from './errors/storage-entity-already-exists.error';
import { StorageEntityRepository } from '../repositories/storage-entity.repository';
import { StorageEntityEntity } from '../entities/storage-entity.entity';
import { ComponentStatus } from '../enums/component.status';
import { ChangeStatusRequestDto } from '../dto/change-status-request.dto';
import { StorageEntityKey } from '../utils/storage-entity-key.utils';

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

  private async isAlreadyExists(requestEntity: StorageEntityRequestDto, parentEntity) {
    const entity = await this.storageEntityRepository.findOne({ where: { parent: parentEntity, name: requestEntity.name } });
    return entity !== undefined;
  }

  private createEntity(requestEntity: StorageEntityRequestDto, parent: StorageEntityEntity) {
    const entity = this.storageEntityRepository.create();
    entity.name = requestEntity.name;
    entity.parent = parent;
    entity.idType = requestEntity.type;
    entity.idCatComponentStatus = ComponentStatus.ACTIVE;
    entity.serialNumber = requestEntity.serialNumber;

    return entity;
  }

  public availableSystems() {
    return this.storageEntityRepository.availableSystems();
  }

  public async updateStatus(key: StorageEntityKey, requestDto: ChangeStatusRequestDto): Promise<StorageEntityEntity> {
    const storageEntity = await this.storageEntityRepository.fetchByStorageEntityKey(key);
    const storageEntityTree = await this.storageEntityRepository.findDescendantsTree(storageEntity);
    return this.updateStatusRecursively(storageEntityTree, requestDto);
  }

  public async updateStatusRecursively(storageEntity: StorageEntityEntity, requestDto: ChangeStatusRequestDto): Promise<StorageEntityEntity> {
    if (storageEntity.children.length > 0) {
      storageEntity.children = await Promise.all(storageEntity.children.map(async child => await this.updateStatusRecursively(child, requestDto)));
    }
    storageEntity.idCatComponentStatus = requestDto.status;
    return await this.storageEntityRepository.save(storageEntity);
  }
}
