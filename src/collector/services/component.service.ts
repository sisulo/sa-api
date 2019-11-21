import { SystemEntity } from '../entities/system.entity';
import { Repository } from 'typeorm';
import { ChaEntity } from '../entities/cha.entity';

export interface ComponentEntity {
  name: string;
  system: SystemEntity | ChaEntity;
}

export class ComponentService<T extends ComponentEntity, U> {
  protected repository: Repository<T>;
  protected type;

  constructor(repository: Repository<T>, type: new() => T) {
    this.repository = repository;
    this.type = type;
  }

  public async create(name: string, system: U): Promise<T> {
    const entity = new this.type();
    entity.system = system;
    entity.name = name;

    return await this.repository.save(entity);
  }
}
