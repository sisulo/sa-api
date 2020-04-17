import { EntityRepository, TreeRepository } from 'typeorm';
import { StorageEntityEntity } from '../entities/storage-entity.entity';
import { KeyPart, StorageEntityKey } from '../controllers/metric.controller';
import { ComponentStatus } from '../enums/component.status';
import { StorageEntityType } from '../dto/owner.dto';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import { LatencyEntity } from '../entities/latency.entity';
import { ArgumentError } from '../services/errors/argument.error';
import { ErrorCodeConst } from '../../errors/error-code.enum';

@EntityRepository(StorageEntityEntity)
export class StorageEntityRepository extends TreeRepository<StorageEntityEntity> {

  public async fetchByStorageEntityKey(key: StorageEntityKey): Promise<StorageEntityEntity> {
    const keyParts = StorageEntityRepository.getKeyParts(key);
    // TODO never looking for different datacenter
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
    let storageEntity = await this.findOneByName(searchKey.name, searchKey.type);
    if (storageEntity === undefined && createIfNotExists === true) {
      storageEntity = this.create(
        { name: searchKey.name, idType: searchKey.type, idCatComponentStatus: ComponentStatus.ACTIVE, parent: parentEntity },
      );
      await this.save(storageEntity);
    } else if (storageEntity === undefined && createIfNotExists === false) {
      throw new ArgumentError(
        ErrorCodeConst.ENTITY_NOT_FOUND, `Cannot find storage entity ${StorageEntityType[searchKey.type]} with name ${searchKey.name}`);
    }
    if (!isEmpty(keyParts)) {
      return this.findOrCreate(keyParts, storageEntity, createIfNotExists);
    }
    storageEntity.parent = parentEntity;
    return storageEntity;
  }

  private async findOneByName(entityName: string, type?: StorageEntityType): Promise<StorageEntityEntity> {
    // TODO never looking for the StorageEntity within correct subtree but looking in global.
    return await this.findOne({ name: entityName, idType: type }, { relations: ['parent'] });
  }

  private static getKeyParts(key: StorageEntityKey): KeyPart[] {
    return [key.child, key.parent, key.grandParent].filter(value => value !== null);
  }

  public async availableSystems(): Promise<StorageEntityEntity[]> {
    return await this.createQueryBuilder('storageEntity')
      .innerJoinAndSelect('storageEntity.children', 'pools')
      .innerJoin(LatencyEntity, 'metric', 'pools.id = metric.owner')
      .andWhere('storageEntity.idType = :type', { type: StorageEntityType.SYSTEM })
      .getMany();
  }
}
