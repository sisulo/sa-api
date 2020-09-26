import { EntityRepository, TreeRepository } from 'typeorm';
import { StorageEntityEntity } from '../entities/storage-entity.entity';
import { ComponentStatus } from '../enums/component.status';
import { StorageEntityType } from '../dto/owner.dto';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import { LatencyEntity } from '../entities/latency.entity';
import { StorageEntityNotFoundError } from '../services/errors/storage-entity-not-found.error';
import { KeyPart, StorageEntityKey } from '../utils/storage-entity-key.utils';

@EntityRepository(StorageEntityEntity)
export class StorageEntityRepository extends TreeRepository<StorageEntityEntity> {

  public async fetchByStorageEntityKey(key: StorageEntityKey): Promise<StorageEntityEntity> {
    const keyParts = StorageEntityRepository.getKeyParts(key);
    // TODO never looking for different dataCenter
    const dataCenterEntity = await this.findOneByName(key.datacenter.name, key.datacenter.type);

    return await this.findOrCreate(keyParts, dataCenterEntity, false);
  }

  public async fetchOrCreateByStorageEntityKey(key: StorageEntityKey): Promise<StorageEntityEntity> {
    const keyParts = StorageEntityRepository.getKeyParts(key);
    const dataCenterEntity = await this.findOneByName(key.datacenter.name, key.datacenter.type);

    return await this.findOrCreate(keyParts, dataCenterEntity, true);
  }

  private async findOrCreate(keyParts: KeyPart[], parentEntity: StorageEntityEntity, createIfNotExists = false): Promise<StorageEntityEntity> {
    const searchKey = keyParts.pop();
    const parentToSearch = parentEntity.idType === StorageEntityType.DATACENTER ? null : parentEntity;
    let storageEntity = await this.findOneByName(searchKey.name, searchKey.type, parentToSearch);
    if (storageEntity === undefined && createIfNotExists === true) {
      storageEntity = this.create(
        { name: searchKey.name, idType: searchKey.type, idCatComponentStatus: ComponentStatus.ACTIVE, parent: parentEntity },
      );
      await this.save(storageEntity);
    } else if (storageEntity === undefined && createIfNotExists === false) {
      throw new StorageEntityNotFoundError(`Cannot find storage entity ${StorageEntityType[searchKey.type]} with name ${searchKey.name}`);
    }
    if (!isEmpty(keyParts)) {
      return this.findOrCreate(keyParts, storageEntity, createIfNotExists);
    }
    storageEntity.parent = parentEntity;
    return storageEntity;
  }

  private async findOneByName(entityName: string, type: StorageEntityType, paramParent: StorageEntityEntity = null): Promise<StorageEntityEntity> {
    const query = this.createQueryBuilder('storageEntity')
      .leftJoinAndSelect('storageEntity.parent', 'parent')
      .leftJoinAndSelect('storageEntity.externals', 'externals')
      .where('storageEntity.name = :name', { name: entityName })
      .andWhere('storageEntity.idType = :type', { type });
    if (paramParent !== null) {
      query.andWhere('storageEntity.parent = :parent', { parent: paramParent.id });
    }
    return await query.getOne();
  }

  private static getKeyParts(key: StorageEntityKey): KeyPart[] {
    return [key.child, key.parent, key.grandParent].filter(value => value !== null);
  }

  public async findDataCenters(): Promise<StorageEntityEntity[]> {
    return await this.createQueryBuilder('datacenter')
      .innerJoinAndSelect('datacenter.children', 'system')
      .innerJoinAndSelect('system.detail', 'detail')
      .andWhere('datacenter.idType = :idType', {idType: StorageEntityType.DATACENTER})
      .andWhere('system.idCatComponentStatus = :status', {status: ComponentStatus.ACTIVE})
      .getMany();
  }
  public async availableSystems(): Promise<StorageEntityEntity[]> {
    return await this.createQueryBuilder('storageEntity')
      .innerJoinAndSelect('storageEntity.children', 'pools')
      .innerJoin(LatencyEntity, 'metric', 'pools.id = metric.owner')
      .andWhere('storageEntity.idType = :type', { type: StorageEntityType.SYSTEM })
      .andWhere('storageEntity.idCatComponentStatus = :status', {status: ComponentStatus.ACTIVE})
      .getMany();
  }
  public async getAllSystems(): Promise<StorageEntityEntity[]> {
    return await this.createQueryBuilder('datacenter')
      .leftJoinAndSelect('datacenter.children', 'system', 'system.idType = :type', { type: StorageEntityType.SYSTEM })
      .leftJoinAndSelect('system.detail', 'detail')
      .andWhere('datacenter.idType = :dcType', {dcType: StorageEntityType.DATACENTER})
      .andWhere('COALESCE(system.idCatComponentStatus, CAST(1 as smallint)) = :status', {status: ComponentStatus.ACTIVE})
      .andWhere('datacenter.idCatComponentStatus = :status')
      .getMany();
  }
}
