import { StorageEntityResponseDto } from '../dto/storage-entity-response.dto';
import { MetricTransformer } from './metric.transformer';
import { ExternalEntity } from '../entities/external.entity';
import { TransformationError } from './transformation.error';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import { StorageEntityEntity } from '../entities/storage-entity.entity';
import { ExternalResponseDto } from '../dto/external-response.dto';
import { ExternalType } from '../enums/external-type.enum';

export class StorageEntityTransformer {

  public static async transformAll(storageEntities: StorageEntityEntity[], reverse= false): Promise<StorageEntityResponseDto[]> {
    return await Promise.all(storageEntities.map(item => StorageEntityTransformer.transform(item, reverse)));
  }

  public static async transform(storageEntity: StorageEntityEntity, reverse = false): Promise<StorageEntityResponseDto> {
    const dto = new StorageEntityResponseDto();
    dto.storageEntity = MetricTransformer.transformFromOwner(storageEntity, reverse);
    const externals = await storageEntity.externals;
    if (!isEmpty(externals)) {
      dto.externals = externals.map(externalEntity => this.transformExternal(externalEntity));
    } else {
      dto.externals = [];
    }
    return dto;
  }

  private static transformExternal(external: ExternalEntity): ExternalResponseDto {
    const dto = new ExternalResponseDto();
    dto.value = external.value;
    if (external.idType === null) {
      throw new TransformationError(`Missing external type entity in ${external}`);
    }
    dto.type = ExternalType[external.idType];
    return dto;
  }
}
