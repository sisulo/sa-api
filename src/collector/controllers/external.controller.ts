import { Body, Controller, Param, Put } from '@nestjs/common';
import { ExternalService } from '../services/external.service';
import { ExternalRequestDto } from '../dto/external-request.dto';
import { StorageEntityTransformer } from '../transformers/storage-entity.transformer';
import { StorageEntityResponseDto } from '../dto/storage-entity-response.dto';

@Controller('api/v1/systems/')
export class ExternalController {
  constructor(private externalService: ExternalService) {
  }

  @Put(':systemName/host-groups/:hostGroupName/externals')
  public async setExternals(@Param('systemName') systemName,
                            @Param('hostGroupName') hostGroupName,
                            @Body() dto: ExternalRequestDto): Promise<StorageEntityResponseDto> {
    const hostGroup = await this.externalService.putExternals(systemName, hostGroupName, dto);
    return StorageEntityTransformer.transform(hostGroup);
  }
}
