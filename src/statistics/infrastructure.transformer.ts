import { DataCenterEntity } from '../collector/entities/data-center.entity';
import { DatacenterDto } from './models/dtos/datacenter.dto';
import { Datacenter } from './models/Datacenter';
import { System } from './models/System';

export class InfrastructureTransformer {
  public static async transform(dataCenterPromise: DataCenterEntity[]): Promise<DatacenterDto> {
    const resultDto = new DatacenterDto();
    resultDto.datacenters = dataCenterPromise.map(
      dataCenter => {
        const dataCenterDto = new Datacenter();
        dataCenterDto.id = dataCenter.idDatacenter;
        dataCenterDto.label = dataCenter.name;
        dataCenterDto.systems = dataCenter.systems.map(system => {
          const systemDto = new System();
          systemDto.id = system.idSystem;
          systemDto.name = system.name;
          return systemDto;
        });
        return dataCenterDto;
      },
    );
    return resultDto;
  }
}
