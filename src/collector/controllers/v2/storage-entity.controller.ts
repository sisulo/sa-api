import { Body, Controller, Post } from '@nestjs/common';
import { StorageEntityResponseDto } from '../../dto/storage-entity-response.dto';
import { StorageEntityService } from '../../services/storage-entity.service';
import { StorageEntityRequestDto } from '../../dto/storage-entity-request.dto';
import { StorageEntityTransformer } from '../../transformers/storage-entity.transformer';
import { StorageEntityRequestPipe } from '../../dto/pipes/storage-entity-request.pipe';

@Controller('api/v2/storage-entities')
export class StorageEntityController {
  constructor(
    private storageEntityService: StorageEntityService,
  ) {}

  @Post()
  public async createStorageEntity(@Body(new StorageEntityRequestPipe()) request: StorageEntityRequestDto): Promise<StorageEntityResponseDto> {
    const entity = await this.storageEntityService.create(request);
    return StorageEntityTransformer.transform(entity);
  }
}
