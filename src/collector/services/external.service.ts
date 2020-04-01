import { Injectable } from '@nestjs/common';
import { ExternalRequestDto } from '../dto/external-request.dto';
import { HostGroupService } from './host-group.service';
import { ExternalDto } from '../dto/external.dto';
import { ExternalEntity } from '../entities/external.entity';
import { ExternalTypeService } from './external-type.service';
import { InjectRepository } from '@nestjs/typeorm';
import { HostGroupEntity } from '../entities/host-group.entity';
import { Repository } from 'typeorm';
import { ExternalType } from '../enums/external-type.enum';
import { StorageEntityNotFound } from './storage-entity-not-found.error';

@Injectable()
export class ExternalService {
  constructor(
    @InjectRepository(HostGroupEntity)
    protected repository: Repository<HostGroupEntity>,
    @InjectRepository(ExternalEntity)
    protected externalRepository: Repository<ExternalEntity>,
    protected hostGroupService: HostGroupService,
    protected externalTypeService: ExternalTypeService) {
  }

  public async putExternals(systemName: string, hostGroupName: string, dto: ExternalRequestDto) {
    const hostGroup = await this.hostGroupService.findByName(hostGroupName, systemName);
    if (hostGroup === undefined) {
      throw new StorageEntityNotFound(`Host-group ${hostGroupName} not found in ${systemName}`);
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
}
