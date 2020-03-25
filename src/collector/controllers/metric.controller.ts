import { Body, Controller, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { MetricRequestDto } from '../dto/metric-request.dto';
import { CollectorType } from '../factory/collector-type.enum';
import { ApiCollectorFactoryImpl } from '../factory/api-collector-factory.impl';
import { LoggingInterceptor } from '../../logging.interceptor';
import { ComponentServiceFactory } from '../factory/component-service.factory';
import { ChangeStatusRequestDto } from '../dto/change-status-request.dto';

export interface ComponentKey {
  parentName: string;
  grandParentName: string;
  childName: string;
}

// TODO create new Error handler for ErrorDto
@UseInterceptors(LoggingInterceptor)
@Controller('api/v1/')
export class MetricController {
  constructor(private factory: ApiCollectorFactoryImpl,
              private componentService: ComponentServiceFactory) {
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
    @Body() dto: MetricRequestDto) {
    const collector = this.factory.getCollector(subComponentType);
    const componentKey = this.createComponentKey(systemName, subComponentName, portName);
    const metricEntity = await collector.collectMetric(componentKey, dto);
    return collector.transform(metricEntity);
  }

  @Post('systems/:systemName/pools/:subComponentName/latencyPerBlockSize')
  async latencyPerBlockSize(
    @Param('systemName') systemName: string,
    @Param('subComponentName') subComponentName: string,
    @Body() dto: MetricRequestDto) {
    return this.insertMetric(systemName, CollectorType.LATENCY, subComponentName, undefined, dto);
  }

  // TODO implement e2e tests for change status
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
    const componentService = this.componentService.getComponentService(subComponentType);
    const componentKey = this.createComponentKey(systemName, subComponentName, portName);
    return componentService.changeStatusByName(componentKey, dto.status);
  }

  private createComponentKey(systemName, subComponentName, portName): ComponentKey {
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
