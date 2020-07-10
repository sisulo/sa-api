import { ApiProperty } from '@nestjs/swagger';

export class StorageEntityDetailRequestDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  serialNumber: string;
  @ApiProperty(
    { required: false },
  )
  arrayModel: string;
  @ApiProperty(
    { required: false },
  )
  dkc: string;
  @ApiProperty(
    { required: false },
  )
  managementIp: string;
  @ApiProperty(
    { required: false },
  )
  rack: string;
  @ApiProperty(
    { required: false },
  )
  prefixReferenceId: string;
  @ApiProperty(
    { required: false },
  )
  room: string;
}
