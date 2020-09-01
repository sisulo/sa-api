import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { SystemDetailEntity } from '../entities/system-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { StorageEntityDetailRequestDto } from '../dto/storage-entity-base-request.dto';

@Injectable()
export class SystemDetailsService {
  constructor(
    @InjectRepository(SystemDetailEntity)
    private readonly systemDetailsRepository: Repository<SystemDetailEntity>) {
  }

  public async upsert(id: number, request: StorageEntityDetailRequestDto) {
    let entity = await this.systemDetailsRepository.findOne(id);
    if (entity === undefined) {
      entity = new SystemDetailEntity();
      entity.id = id;
    }
    entity.model = request.arrayModel;
    entity.dkc = request.dkc;
    entity.managementIp = request.managementIp;
    entity.rack = request.rack;
    entity.room = request.room;
    entity.prefixReferenceId = request.prefixReferenceId;
    entity.sortId = request.sortId;

    return await this.systemDetailsRepository.save(entity);
  }
}
