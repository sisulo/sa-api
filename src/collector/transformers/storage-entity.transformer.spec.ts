import { CollectorUtils } from '../../tests/collector.utils';
import { HostGroupEntity } from '../entities/host-group.entity';
import { StorageEntityTransformer } from './storage-entity.transformer';
import { StorageEntityResponseDto } from '../dto/storage-entity-response.dto';
import { TransformationError } from './transformation.error';

describe('Storage entity Transformers', () => {

  it('should return StorageEntityResponse from HostGroupEntity', () => {
    const entity: HostGroupEntity = CollectorUtils.createHostGroupEntity();
    entity.externals = [CollectorUtils.createExternal()];
    const result: StorageEntityResponseDto = CollectorUtils.createHostGroupResponseDto();
    expect(StorageEntityTransformer.transform(entity)).toStrictEqual(result);
  });

  it('should throw Transformation error', () => {
    const entity: HostGroupEntity = CollectorUtils.createHostGroupEntity();
    const external = CollectorUtils.createExternal();
    external.externalTypeEntity = null;
    entity.externals = [external];
    expect(() => {
      StorageEntityTransformer.transform(entity);
    }).toThrowError(TransformationError);
  });
});
