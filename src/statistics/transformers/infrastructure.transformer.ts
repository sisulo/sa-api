import { DatacenterDto } from '../models/dtos/datacenter.dto';
import { Datacenter } from '../models/Datacenter';
import { System } from '../models/System';
import { StorageEntityEntity } from '../../collector/entities/storage-entity.entity';

export class InfrastructureTransformer {
  public static async transform(dataCenterPromise: StorageEntityEntity[]): Promise<DatacenterDto> {
    const resultDto = new DatacenterDto();
    resultDto.datacenters = dataCenterPromise.map(
      dataCenter => {
        const dataCenterDto = new Datacenter();
        dataCenterDto.id = dataCenter.id;
        dataCenterDto.label = dataCenter.name;
        dataCenterDto.systems = dataCenter.children.map(system => {
          const systemDto = new System();
          systemDto.id = system.id;
          systemDto.name = system.name;
          return systemDto;
        });
        return dataCenterDto;
      },
    );
    return resultDto;
  }
}
