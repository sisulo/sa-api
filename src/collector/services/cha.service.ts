import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChaEntity } from '../entities/cha.entity';
import { CreateComponentInterface } from './createComponentInterface';
import { ComponentService } from './component.service';
import { SystemEntity } from '../entities/system.entity';

@Injectable()
export class ChaService extends ComponentService<ChaEntity, SystemEntity> implements CreateComponentInterface<ChaEntity, SystemEntity> {

  constructor(
    @InjectRepository(ChaEntity)
    protected readonly repository: Repository<ChaEntity>,
  ) {
    super(repository, ChaEntity);
  }

  async findByName(childName: string, parentName: string): Promise<ChaEntity> {
    return await this.repository.createQueryBuilder('cha')
      .leftJoinAndSelect('cha.system', 'system')
      .where('cha.name=:chaName', { chaName: childName })
      .andWhere('system.name=:systemName', { systemName: parentName })
      .getOne();
  }

  public async findById(idSystemParam: number, idChaParam: number): Promise<ChaEntity> {
    return await this.repository
      .findOne({ idCha: idChaParam })
      .then(metricType => metricType);
  }
}
