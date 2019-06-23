import { Body, Controller, Param, Post } from '@nestjs/common';
import { ChaMetricRequestDto } from '../dto/cha-metric-request.dto';
import { ChaMetricEntity } from '../entities/cha-metric.entity';
import { ChaMetricService } from '../cha-metric.service';

@Controller('/api/v1/systems/:idSystem/chas')
export class ChaMetricController {

  constructor(readonly service: ChaMetricService) {
  }

// TODO respond with ResponseDto
  @Post(':idCha/metrics')
  upsert(@Param('idSystem') idSystem: string, @Param('idCha') idCha: string, @Body() request: ChaMetricRequestDto): Promise<ChaMetricEntity> {
    return this.service.upsert(parseInt(idSystem, 10), parseInt(idCha, 10), request).then(value => {
      return value;
    });
  }
}
