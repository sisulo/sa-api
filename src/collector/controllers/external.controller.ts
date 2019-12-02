import { Body, Controller, Param, Put } from '@nestjs/common';
import { ExternalService } from '../services/external.service';
import { ExternalRequestDto } from '../dto/external-request.dto';

@Controller('api/v1/systems/')
export class ExternalController {
  constructor(private externalService: ExternalService) {
  }

  @Put(':systemName/host-groups/:hostGroupName/externals')
  public async setExternals(@Param('systemName') systemName,
                            @Param('hostGroupName') hostGroupName,
                            @Body() dto: ExternalRequestDto) {
    // TODO transform external to the Dto
    return this.externalService.putExternals(systemName, hostGroupName, dto);
  }
}
