import { Body, Controller, Param, Put } from '@nestjs/common';
import { ExternalService } from '../services/external.service';
import { ExternalRequestDto } from '../dto/external-request.dto';
import { StorageEntityTransformer } from '../transformers/storage-entity.transformer';
import { StorageEntityResponseDto } from '../dto/storage-entity-response.dto';
import { CollectorType } from '../factory/collector-type.enum';
import { StorageEntityKeyUtils } from '../utils/storage-entity-key.utils';

@Controller('api/v1/systems/')
export class ExternalController {
  constructor(private externalService: ExternalService) {
  }

  @Put(':systemName/:subComponent/:componentName/externals')
  public async setExternals(@Param('systemName') systemName,
                            @Param('componentName') componentName,
                            @Param('subComponent') type: CollectorType,
                            @Body() dto: ExternalRequestDto): Promise<StorageEntityResponseDto> {
    const key = StorageEntityKeyUtils.createComponentKey(systemName, componentName, null, StorageEntityKeyUtils.of(type));
    const storageEntity = await this.externalService.putExternals(key, dto);
    return StorageEntityTransformer.transform(storageEntity);
  }
}
