import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChaEntity } from '../entities/cha.entity';
import { CreateComponentInterface } from './createComponentInterface';
import { ComponentService } from './component.service';
import { SystemEntity } from '../entities/system.entity';
import { ComponentKey } from '../controllers/metric.controller';
import { ComponentStatus } from '../enums/component.status';

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
      .leftJoinAndSelect('cha.ports', 'port')
      .where('cha.name=:chaName', { chaName: childName })
      .andWhere('system.name=:systemName', { systemName: parentName })
      .getOne();
  }

  public async findById(idSystemParam: number, idChaParam: number): Promise<ChaEntity> {
    return await this.repository
      .findOne({ id: idChaParam })
      .then(metricType => metricType);
  }

  public async changeStatusByName(key: ComponentKey, status: ComponentStatus): Promise<ChaEntity> {
    const chaEntity = await this.findByName(key.childName, key.parentName);
    if (chaEntity === undefined) {
      throw new Error('Pool ${poolName} not found in ${systemName}');
    }
    const intStatus = parseInt(ComponentStatus[status], 10) || null;
    chaEntity.ports = chaEntity.ports.map(port => {
      port.idCatComponentStatus = intStatus;
      return port;
    });
    chaEntity.idCatComponentStatus = intStatus;
    await this.repository.save(chaEntity);

    return chaEntity;
  }
}
