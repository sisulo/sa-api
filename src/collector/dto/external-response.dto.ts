import { ApiProperty } from '@nestjs/swagger';

export class ExternalResponseDto {
  @ApiProperty({ example: 'TIER' })
  type: string;
  @ApiProperty({ example: 'T1' })
  value: string;
}
