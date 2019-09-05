import { SystemEntity } from '../entities/system.entity';

export interface CreateComponentInterface<T> {
  create(componentName: string, system?: SystemEntity): Promise<T>;

  findByName(parentName: string, childName: string): Promise<T>;
}
