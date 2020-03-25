import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChaEntity } from '../entities/cha.entity';
import { CreateComponentInterface } from './createComponentInterface';
import { ComponentService } from './component.service';
import { PortEntity } from '../entities/port.entity';
import { ComponentStatus } from '../enums/component.status';
import { ComponentKey } from '../controllers/metric.controller';

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
      .findOne({ id: idPortParam })
      .then(metricType => metricType);
  }

  public async changeStatusByName(key: ComponentKey, status: ComponentStatus): Promise<PortEntity> {
    const port = await this.findByName(key.childName, key.parentName, key.grandParentName);
    if (port === undefined) {
      throw new Error('Pool ${poolName} not found in ${systemName}');
    }
    port.idCatComponentStatus = parseInt(ComponentStatus[status], 10) || null;
    return await this.repository.save(port);
  }
}
