import { SystemEntity } from '../entities/system.entity';
import { Repository } from 'typeorm';

export interface ComponentEntity {
  name: string;
  system: SystemEntity;
}

export class ComponentService<T extends ComponentEntity> {
  protected repository: Repository<T>;
  protected type;

  constructor(repository: Repository<T>, type: new() => T) {
    this.repository = repository;
    this.type = type;
  }

  public async create(name: string, system: SystemEntity): Promise<T> {
    const entity = new this.type();
    entity.system = system;
    entity.name = name;

    const saved = await this.repository.save(entity);
    return saved;
  }
}
