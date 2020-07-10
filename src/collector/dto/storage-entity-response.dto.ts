import { Owner } from './owner.dto';
import { ExternalResponseDto } from './external-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { StorageEntityDetailResponseDto } from './storage-entity-detail-response.dto';

export class StorageEntityResponseDto {
  @ApiProperty()
  storageEntity: Owner;
  @ApiProperty({isArray: true, type: ExternalResponseDto})
  externals: ExternalResponseDto[];
  @ApiProperty()
  detail: StorageEntityDetailResponseDto;
}
