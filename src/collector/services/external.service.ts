import { Injectable } from '@nestjs/common';
import { ExternalRequestDto } from '../dto/external-request.dto';
import { ExternalDto } from '../dto/external.dto';
import { ExternalEntity } from '../entities/external.entity';
import { ExternalTypeService } from './external-type.service';
import { InjectRepository } from '@nestjs/typeorm';
import { HostGroupEntity } from '../entities/host-group.entity';
import { Repository } from 'typeorm';
import { ExternalType } from '../enums/external-type.enum';
import { StorageEntityNotFound } from './storage-entity-not-found.error';
import { CollectorType } from '../factory/collector-type.enum';
import { HostGroupRepository } from '../repositories/host-group.repository';
import { PoolRepository } from '../repositories/pool.repository';

@Injectable()
export class ExternalService {
  constructor(
    @InjectRepository(HostGroupEntity)
    protected repository: Repository<HostGroupEntity>,
    @InjectRepository(ExternalEntity)
    protected externalRepository: Repository<ExternalEntity>,
    protected hostGroupRepository: HostGroupRepository,
    protected poolRepository: PoolRepository,
    protected externalTypeService: ExternalTypeService) {
  }

  public async putExternals(type: CollectorType, systemName: string, hostGroupName: string, dto: ExternalRequestDto) {
    const storageEntityRepo = this.getRepository(type);
    const hostGroup = await this.hostGroupRepository.findByName(hostGroupName, systemName);
    if (hostGroup === undefined) {
      throw new StorageEntityNotFound(`Storage entity ${hostGroupName} not found in ${systemName}`);
    }
    if (hostGroup.externals !== undefined && hostGroup.externals.length > 0) {
      await this.externalRepository.delete(hostGroup.externals.map(external => external.idExternal));
    }
    hostGroup.externals = await Promise.all(dto.data.map(external => this.createExternal(external)));
    return this.repository.save(hostGroup);
  }

  private async createExternal(external: ExternalDto) {
    const entity = new ExternalEntity();
    entity.externalTypeEntity = await this.externalTypeService.findById(parseInt(ExternalType[external.type], 10));
    entity.value = external.value;
    return entity;
  }

  private getRepository(type: CollectorType) {
    switch (type) {
      case CollectorType.HOST_GROUPS:
        return this.hostGroupRepository;
      case CollectorType.POOLS:
        return this.poolRepository;

    }
  }
}
