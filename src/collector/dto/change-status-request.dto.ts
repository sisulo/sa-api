import { StorageEntityStatus } from '../enums/storage-entity-status.enum';

export class ChangeStatusRequestDto {
  readonly status: StorageEntityStatus;
}
