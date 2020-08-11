import { StorageEntityResponseDto } from '../dto/storage-entity-response.dto';
import { MetricTransformer } from './metric.transformer';
import { ExternalEntity } from '../entities/external.entity';
import { TransformationError } from './transformation.error';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import { StorageEntityEntity } from '../entities/storage-entity.entity';
import { ExternalResponseDto } from '../dto/external-response.dto';
import { ExternalType } from '../enums/external-type.enum';
import { SystemDetailEntity } from '../entities/system-detail.entity';
import { StorageEntityDetailResponseDto } from '../dto/storage-entity-detail-response.dto';
import { Owner, StorageEntityType } from '../dto/owner.dto';
import { ComponentStatus } from '../enums/component.status';

export class StorageEntityTransformer {

  public static async transformAll(storageEntities: StorageEntityEntity[], reverse = false, withDetail = true): Promise<StorageEntityResponseDto[]> {
    return await Promise.all(storageEntities.map(item => StorageEntityTransformer.transform(item, reverse, withDetail)));
  }

  public static transform(storageEntity: StorageEntityEntity, reverse = false, withDetail = false): StorageEntityResponseDto {
    const dto = new StorageEntityResponseDto();
    dto.storageEntity = StorageEntityTransformer.transformFromOwner(storageEntity, reverse, withDetail);
    const externals = storageEntity.externals;
    if (!isEmpty(externals)) {
      dto.externals = externals.map(externalEntity => this.transformExternal(externalEntity));
    } else {
      dto.externals = [];
    }
    if (withDetail === true && storageEntity.detail !== undefined && storageEntity.detail !== null) {
      dto.detail = StorageEntityTransformer.transformDetail(storageEntity.detail);
    }
    return dto;
  }

  public static transformDetail(detailEntity: SystemDetailEntity) {
    const detailDto = new StorageEntityDetailResponseDto();
    detailDto.arrayModel = detailEntity.model;
    detailDto.dkc = detailEntity.dkc;
    detailDto.managementIp = detailEntity.managementIp;
    detailDto.rack = detailEntity.rack;
    detailDto.room = detailEntity.room;
    detailDto.prefixReferenceId = detailEntity.prefixReferenceId;
    return detailDto;
  }

  public static transformExternal(external: ExternalEntity): ExternalResponseDto {
    const dto = new ExternalResponseDto();
    dto.value = external.value;
    if (external.idType === null) {
      throw new TransformationError(`Missing external type entity in ${external}`);
    }
    dto.type = ExternalType[external.idType];
    return dto;
  }

  public static transformFromOwner(metricOwner, reverse = false, withDetail = false) {
    if (metricOwner === null) {
      throw new TransformationError(`Cannot transform owner because it is null`);
    }
    const dto = new Owner();
    dto.id = metricOwner.id;
    dto.name = metricOwner.name;
    dto.type = StorageEntityTransformer.resolveOwnerType(metricOwner);
    dto.status = this.resolveStatus(metricOwner);
    if (reverse === false && metricOwner.parent !== undefined && metricOwner.parent !== null) {
      dto.parent = StorageEntityTransformer.transformFromOwner(metricOwner.parent, withDetail);
    } else if (reverse === true && !isEmpty(metricOwner.children)) {
      dto.children = metricOwner.children.map(child => StorageEntityTransformer.transformFromOwner(child, reverse, withDetail));
    }
    if (withDetail === true && metricOwner.detail !== undefined && metricOwner.detail !== null) {
      dto.detail = StorageEntityTransformer.transformDetail(metricOwner.detail);
    }
    if (metricOwner.serialNumber !== null) {
      dto.serialNumber = metricOwner.serialNumber;
    }
    return dto;
  }

  private static resolveStatus(metricOwner) {
    return ComponentStatus[metricOwner.idCatComponentStatus];
  }

  private static resolveOwnerType(metricOwner) {
    switch (metricOwner.idType) {
      case StorageEntityType.SYSTEM:
        return StorageEntityType[StorageEntityType.SYSTEM];
      case StorageEntityType.POOL:
        return StorageEntityType[StorageEntityType.POOL];
      case StorageEntityType.HOST_GROUP:
        return StorageEntityType[StorageEntityType.HOST_GROUP];
      case StorageEntityType.ADAPTER:
        return StorageEntityType[StorageEntityType.ADAPTER];
      case StorageEntityType.PORT:
        return StorageEntityType[StorageEntityType.PORT];
      case StorageEntityType.DATACENTER:
        return StorageEntityType[StorageEntityType.DATACENTER];
      default:
        throw new TransformationError(`Type '${metricOwner.constructor.name}' is not possible to map to StorageEntityType`);
    }
  }
}
