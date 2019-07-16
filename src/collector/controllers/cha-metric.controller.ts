import { Body, Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { ChaMetricRequestDto } from '../dto/cha-metric-request.dto';
import { ChaMetricService } from '../services/cha-metric.service';
import { ChaMetricResponseTransformer } from '../transformers/cha-metric-response.transformer';
import { ChaMetricResponseDto } from '../dto/cha-metric-response.dto';
import { LoggingInterceptor } from '../../logging.interceptor';

@Controller('/api/v1/systems/:idSystem/chas')
@UseInterceptors(LoggingInterceptor)
export class ChaMetricController {

  constructor(readonly service: ChaMetricService) {
  }

  @Post(':idCha/metrics')
  async upsert(@Param('idSystem') idSystem: string, @Param('idCha') idCha: string, @Body() request: ChaMetricRequestDto): Promise<ChaMetricResponseDto> {
    const metric = await this.service.upsert(parseInt(idSystem, 10), parseInt(idCha, 10), request).then(dao => dao);
    return ChaMetricResponseTransformer.transform(metric);
  }
}
