import { Injectable } from '@nestjs/common';
import { ExternalRequestDto } from '../dto/external-request.dto';
import { ExternalDto } from '../dto/external.dto';
import { ExternalEntity } from '../entities/external.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageEntityNotFound } from './storage-entity-not-found.error';
import { StorageEntityKey } from '../utils/storage-entity-key.utils';
import { StorageEntityRepository } from '../repositories/storage-entity.repository';
import { StorageEntityEntity } from '../entities/storage-entity.entity';

@Injectable()
export class ExternalService {
  constructor(
    @InjectRepository(ExternalEntity)
    protected externalRepository: Repository<ExternalEntity>,
    protected storageEntityRepository: StorageEntityRepository) {
  }

  public async putExternals(key: StorageEntityKey, dto: ExternalRequestDto) {
    const storageEntity = await this.storageEntityRepository.fetchByStorageEntityKey(key);
    if (storageEntity === undefined) {
      throw new StorageEntityNotFound(`Storage entity not found in ${key}`);
    }
    const externals = storageEntity.externals;
    if (externals !== undefined && externals.length > 0) {
      await this.externalRepository.delete(externals.map(external => external.idExternal));
    }
    storageEntity.externals = await Promise.all(dto.data.map(external => this.createExternal(storageEntity, external)));
    return await this.storageEntityRepository.save(storageEntity);
  }

  private createExternal(storageEntity: StorageEntityEntity, external: ExternalDto) {
    const entity = new ExternalEntity();
    entity.idType = external.type;
    entity.value = external.value;
    entity.storageEntity = Promise.resolve(storageEntity);
    return this.externalRepository.save(entity);
  }

}
