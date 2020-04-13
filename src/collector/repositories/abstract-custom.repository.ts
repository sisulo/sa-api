import { getCustomRepository, Repository } from 'typeorm';
import { FindParentInterface } from './find-parent.interface';

// tslint:disable-next-line:max-line-length
export class AbstractCustomRepository<Entity, ParentEntityRepository extends Repository<any>> extends Repository<Entity> implements FindParentInterface {

  private parentRepository: ParentEntityRepository;

  constructor(c: new () => ParentEntityRepository) {
    super();
    this.parentRepository = getCustomRepository(c);
  }

  findParent(parentId: number): Promise<any> {
    if (this.parentRepository !== undefined) {
      return this.parentRepository.findOne(parentId);
    }
  }
}
