import { Repository } from 'typeorm';
import { CatExternalTypeEntity } from '../entities/cat-external-type.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class ExternalTypeService {

  constructor(
    @InjectRepository(CatExternalTypeEntity)
    private repository: Repository<CatExternalTypeEntity>) {
  }

  public async findById(idType) {
    return await this.repository.findOne({ idCatExternalType: idType });
  }
}
