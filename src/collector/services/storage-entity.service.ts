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
import { SystemDetailsService } from './system-details.service';
import { StorageEntityDetailRequestDto } from '../dto/storage-entity-base-request.dto';
import { StorageEntityNotFoundError } from './errors/storage-entity-not-found.error';

@Injectable()
export class StorageEntityService {
  private static CHECK_DUPLICITY_TYPE = [StorageEntityType.DATACENTER, StorageEntityType.SYSTEM, StorageEntityType.POOL];

  constructor(
    private storageEntityRepository: StorageEntityRepository,
    private systemDetailsService: SystemDetailsService,
  ) {
  }

  async create(requestEntity: StorageEntityRequestDto): Promise<StorageEntityEntity> {
    let parent;
    if (requestEntity.type !== StorageEntityType.DATACENTER) {

      parent = await this.storageEntityRepository.findOne(requestEntity.parentId);
      if (parent === undefined) {
        throw new ArgumentError(ErrorCodeConst.ENTITY_NOT_FOUND, `Database entity with id \'${requestEntity.parentId}\' was not found`);
      }

      if (await this.isAlreadyExists(requestEntity, parent)) {
        throw new StorageEntityAlreadyExistsError(
          `Storage Entity \'${StorageEntityType[requestEntity.type]}\' `
          + `with name \'${requestEntity.name}\' already exists.`);
      }
    } else {
      parent = null;
    }

    const entity = this.createEntity(requestEntity, parent);

    return await this.storageEntityRepository.save(entity);
  }

  private async isAlreadyExists(requestEntity: StorageEntityRequestDto, parentEntity) {

    const entity = await this.storageEntityRepository.findOne({
      where: { name: requestEntity.name },
      join: { alias: 'storageEntity', leftJoinAndSelect: { parent: 'storageEntity.parent' } },
    });
    if (StorageEntityService.CHECK_DUPLICITY_TYPE.includes(requestEntity.type)) {
      return entity !== undefined && entity.idType === requestEntity.type;
    }
    return entity !== undefined && entity.parent.id === parentEntity.id;
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

  public getAllSystems() {
    return this.storageEntityRepository.getAllSystems();
  }

  public async updateStatus(key: StorageEntityKey, requestDto: ChangeStatusRequestDto): Promise<StorageEntityEntity> {
    const storageEntity = await this.storageEntityRepository.fetchByStorageEntityKey(key);
    const storageEntityTree = await this.storageEntityRepository.findDescendantsTree(storageEntity);
    return this.updateStatusRecursively(storageEntityTree, requestDto);
  }

  public async updateStatusById(id: number, requestDto: ChangeStatusRequestDto): Promise<StorageEntityEntity> {
    const storageEntity = await this.storageEntityRepository.findOne(id);
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

  async update(id: number, request: StorageEntityDetailRequestDto) {
    const entity = await this.storageEntityRepository.findOne(id);

    if (entity === undefined) {
      throw new ArgumentError(ErrorCodeConst.ENTITY_NOT_FOUND, `Database entity with id \'${id}\' was not found`);
    }

    entity.name = request.name;
    entity.serialNumber = request.serialNumber;
    entity.detail = await this.systemDetailsService.upsert(id, request);
    return await this.storageEntityRepository.save(entity);

  }

  async delete(id: number) {
    const entity = await this.storageEntityRepository.findOne(id);
    if (entity === undefined || entity.idCatComponentStatus === ComponentStatus.INACTIVE) {
      throw new StorageEntityNotFoundError(`Entity(id: ${id}) not found or is INACTIVE.`);
    }
    entity.idCatComponentStatus = ComponentStatus.INACTIVE;
    await this.storageEntityRepository.save(entity);
    await this.storageEntityRepository.query(
      'DELETE FROM storage_entities_closure ' +
      'WHERE id_descendant IN (SELECT id_descendant ' +
      '                     FROM storage_entities_closure ' +
      '                     WHERE id_ancestor = ' + id + ');',
    );
  }

  async move(id: number, parentId: number) {
    const entity = await this.storageEntityRepository.findOne(id);
    if (entity === undefined || entity.idCatComponentStatus === ComponentStatus.INACTIVE) {
      throw new StorageEntityNotFoundError(`Entity(id: ${id}) not found or is INACTIVE.`);
    }
    const parentEntity = await this.storageEntityRepository.findOne(parentId);
    if (parentEntity === undefined || parentEntity.idCatComponentStatus === ComponentStatus.INACTIVE) {
      throw new StorageEntityNotFoundError(`Entity(id: ${parentId}) not found or is INACTIVE.`);
    }
    this.storageEntityRepository.query(`
      DELETE FROM storage_entities_closure
      WHERE id_descendant IN (SELECT id_descendant
                     FROM storage_entities_closure
                     WHERE id_ancestor = ${id})
      AND id_ancestor IN (SELECT id_ancestor
                     FROM storage_entities_closure
                     WHERE id_descendant = ${id}
                     AND id_ancestor != id_descendant);
    `);

    this.storageEntityRepository.query(`
INSERT INTO storage_entities_closure (id_ancestor, id_descendant)
SELECT supertree.id_ancestor, subtree.id_descendant
FROM storage_entities_closure AS supertree
CROSS JOIN storage_entities_closure AS subtree
WHERE supertree.id_descendant = ${parentId}
AND subtree.id_ancestor = ${id};
    `);
    entity.parent = parentEntity;
    await this.storageEntityRepository.save(entity);
  }
}
