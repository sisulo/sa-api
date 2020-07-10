import { StorageEntityType } from './owner.dto';
import { ApiProperty } from '@nestjs/swagger';

export class StorageEntityRequestDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  serialNumber: string;
  @ApiProperty({
    enumName: 'StorageEntityType',
    enum: StorageEntityType,
  })
  type: StorageEntityType;
  @ApiProperty()
  parentId: number;
}
