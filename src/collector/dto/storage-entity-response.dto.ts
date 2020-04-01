import { Owner } from './owner.dto';
import { ExternalDto } from './external.dto';

export class StorageEntityResponseDto {
  storageEntity: Owner;
  externals: ExternalDto[];
}
