import { Body, Controller, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { MetricRequestDto } from '../dto/metric-request.dto';
import { CollectorType } from '../factory/collector-type.enum';
import { ApiCollectorFactoryImpl } from '../factory/api-collector-factory.impl';
import { LoggingInterceptor } from '../../logging.interceptor';
import { StorageEntityServiceFactory } from '../factory/storage-entity-service.factory';
import { ChangeStatusRequestDto } from '../dto/change-status-request.dto';
import { MetricResponseDto } from '../dto/metric-response.dto';
import { StorageEntityTransformer } from '../transformers/storageEntityTransformer';

export interface ComponentKey {
  parentName: string;
  grandParentName: string;
  childName: string;
}

@UseInterceptors(LoggingInterceptor)
@Controller('api/v1/')
export class MetricController {
  constructor(private factory: ApiCollectorFactoryImpl,
              private storageEntityServiceFactory: StorageEntityServiceFactory) {
  }

  @Post([
    ':subComponent/:systemName/metrics',
    'systems/:systemName/:subComponent/:subComponentName/metrics',
    'systems/:systemName/chas/:subComponentName/:subComponent/:portName/metrics',
  ])
  async insertMetric(
    @Param('systemName') systemName: string,
    @Param('subComponent') subComponentType: CollectorType,
    @Param('subComponentName') subComponentName: string,
    @Param('portName') portName: string,
    @Body() dto: MetricRequestDto): Promise<MetricResponseDto> {
    const collector = this.factory.getCollector(subComponentType);
    const componentKey = MetricController.createComponentKey(systemName, subComponentName, portName);
    const metricEntity = await collector.collectMetric(componentKey, dto);
    return this.factory.getTransformer(subComponentType).transform(metricEntity);
  }

  @Post('systems/:systemName/pools/:subComponentName/latencyPerBlockSize')
  async latencyPerBlockSize(
    @Param('systemName') systemName: string,
    @Param('subComponentName') subComponentName: string,
    @Body() dto: MetricRequestDto) {
    return this.insertMetric(systemName, CollectorType.LATENCY, subComponentName, undefined, dto);
  }

  @Put([
    ':subComponent/:systemName/status',
    'systems/:systemName/:subComponent/:subComponentName/status',
    'systems/:systemName/chas/:subComponentName/:subComponent/:portName/status',
  ])
  async changeStatus(
    @Param('systemName') systemName: string,
    @Param('subComponent') subComponentType: CollectorType,
    @Param('subComponentName') subComponentName: string,
    @Param('portName') portName: string,
    @Body() dto: ChangeStatusRequestDto,
  ) {
    const componentService = this.storageEntityServiceFactory.getStorageEntityService(subComponentType);
    const componentKey = MetricController.createComponentKey(systemName, subComponentName, portName);
    return StorageEntityTransformer.transform(await componentService.changeStatusByName(componentKey, dto.status));
  }

  private static createComponentKey(systemName, subComponentName, portName): ComponentKey {
    let componentKey: ComponentKey;
    if (portName !== undefined) {
      componentKey = { parentName: subComponentName, grandParentName: systemName, childName: portName } as ComponentKey;
    } else if (subComponentName !== undefined) {
      componentKey = { childName: subComponentName, parentName: systemName } as ComponentKey;
    } else {
      componentKey = { childName: systemName } as ComponentKey;
    }
    return componentKey;
  }
}
