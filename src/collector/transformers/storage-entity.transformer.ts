import { HostGroupEntity } from '../entities/host-group.entity';
import { StorageEntityResponseDto } from '../dto/storage-entity-response.dto';
import { MetricTransformer } from './metric.transformer';
import { ExternalEntity } from '../entities/external.entity';
import { ExternalDto } from '../dto/external.dto';
import { TransformationError } from './transformation.error';
import { SystemEntity } from '../entities/system.entity';
import { PoolEntity } from '../entities/pool.entity';
import { PortEntity } from '../entities/port.entity';
import { ChaEntity } from '../entities/cha.entity';
import { isEmpty } from '@nestjs/common/utils/shared.utils';

export class StorageEntityTransformer {
  public static transform(storageEntity: HostGroupEntity | SystemEntity | PoolEntity
    | PortEntity | ChaEntity) {
    const dto = new StorageEntityResponseDto();
    dto.storageEntity = MetricTransformer.transformFromOwner(storageEntity);

    if (storageEntity instanceof HostGroupEntity && !isEmpty(storageEntity.externals)) {
      dto.externals = storageEntity.externals.map(externalEntity => this.transformExternal(externalEntity));
    } else {
      dto.externals = [];
    }
    return dto;
  }

  private static transformExternal(external: ExternalEntity): ExternalDto {
    const dto = new ExternalDto();
    dto.value = external.value;
    if (external.externalTypeEntity === null) {
      throw new TransformationError(`Missing external type entity in ${external}`);
    }
    dto.type = external.externalTypeEntity.idCatExternalType;
    return dto;
  }
}
