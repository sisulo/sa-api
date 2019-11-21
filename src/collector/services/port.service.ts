import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChaEntity } from '../entities/cha.entity';
import { CreateComponentInterface } from './createComponentInterface';
import { ComponentService } from './component.service';
import { PortEntity } from '../entities/port.entity';

@Injectable()
export class PortService extends ComponentService<PortEntity, ChaEntity> implements CreateComponentInterface<PortEntity, ChaEntity> {

  constructor(
    @InjectRepository(PortEntity)
    protected readonly repository: Repository<PortEntity>,
  ) {
    super(repository, PortEntity);
  }

  async findByName(grandChildName: string, childName: string, parentName: string): Promise<PortEntity> {
    return await this.repository.createQueryBuilder('port')
      .leftJoinAndSelect('port.system', 'cha')
      .leftJoinAndSelect('cha.system', 'system')
      .where('port.name=:portName', { portName: grandChildName })
      .andWhere('cha.name=:chaName', { chaName: childName })
      .andWhere('system.name=:systemName', { systemName: parentName })
      .getOne();
  }

  public async findById(idSystemParam: number, idChaParam: number, idPortParam: number): Promise<PortEntity> {
    return await this.repository
      .findOne({ idPort: idPortParam })
      .then(metricType => metricType);
  }
}
