import { EntityRepository, TreeRepository } from 'typeorm';
import { StorageEntityEntity } from '../entities/storage-entity.entity';

@EntityRepository(StorageEntityEntity)
export class StorageEntityRepository extends TreeRepository<StorageEntityEntity> {

}
