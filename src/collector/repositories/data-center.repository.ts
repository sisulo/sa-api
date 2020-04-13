import { EntityRepository, Repository } from 'typeorm';
import { DataCenterEntity } from '../entities/data-center.entity';

@EntityRepository(DataCenterEntity)
export class DataCenterRepository extends Repository<DataCenterEntity> {

}
