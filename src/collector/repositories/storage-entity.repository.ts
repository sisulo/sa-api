import { EntityRepository, TreeRepository } from 'typeorm';
import { StorageEntityEntity } from '../entities/storage-entity.entity';
import { KeyPart, StorageEntityKey } from '../controllers/metric.controller';
import { ComponentStatus } from '../enums/component.status';
import { StorageEntityType } from '../dto/owner.dto';
import { isEmpty } from '@nestjs/common/utils/shared.utils';

@EntityRepository(StorageEntityEntity)
export class StorageEntityRepository extends TreeRepository<StorageEntityEntity> {

  public async fetchOrCreateByStorageEntityKey(key: StorageEntityKey): Promise<StorageEntityEntity> {
    const keyParts = StorageEntityRepository.getKeyParts(key);
    const dataCenterEntity = await this.findOneByName(key.datacenter.name, key.datacenter.type);

    return await this.findOrCreate(keyParts, dataCenterEntity);
  }

  private async findOrCreate(keyParts: KeyPart[], parentEntity: StorageEntityEntity): Promise<StorageEntityEntity> {
    const searchKey = keyParts.pop();
    let storageEntity = await this.findOneByName(searchKey.name, searchKey.type);
    if (storageEntity === undefined) {
      storageEntity = this.create(
        { name: searchKey.name, idType: searchKey.type, idCatComponentStatus: ComponentStatus.ACTIVE, parent: parentEntity },
      );
      await this.save(storageEntity);
    }
    if (!isEmpty(keyParts)) {
      return this.findOrCreate(keyParts, storageEntity);
    }
    storageEntity.parent = parentEntity;
    return storageEntity;
  }

  private async findOneByName(entityName: string, type?: StorageEntityType): Promise<StorageEntityEntity> {
    return await this.findOne({ name: entityName, idType: type }, { relations: ['parent'] });
  }

  private static getKeyParts(key: StorageEntityKey): KeyPart[] {
    return [key.child, key.parent, key.grandParent].filter(value => value !== null);
  }
}
