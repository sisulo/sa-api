import { Body, Controller, HttpException, NotFoundException, Param, Post, UseInterceptors } from '@nestjs/common';
import { MetricRequestDto } from '../dto/metric-request.dto';
import { CollectorType } from '../factory/collector-type.enum';
import { ApiCollectorFactoryImpl } from '../factory/api-collector-factory.impl';
import { LoggingInterceptor } from '../../logging.interceptor';
import { StorageEntityServiceFactory } from '../factory/storage-entity-service.factory';
import { MetricResponseDto } from '../dto/metric-response.dto';
import { MetricRequestPipe } from '../dto/pipes/metric-request-pipe.service';
import { StorageEntityType } from '../dto/owner.dto';
import { MetricCollectorService } from '../services/collect/metric-collector.service';
import { MetricTransformer } from '../transformers/metric.transformer';
import { ArgumentError } from '../services/errors/argument.error';
import { ErrorCodeConst } from '../../errors/error-code.enum';
import { LatencyMetricTransformer } from '../transformers/latency-metric.transformer';
import { LatencyEntity } from '../entities/latency.entity';
import { MultiValueMetricCollectorService } from '../services/collect/multi-value-metric-collector.service';
import { AbstractMetricCollectorService } from '../services/collect/abstract-metric-collector.service';

export interface KeyPart {
  name: string;
  type: StorageEntityType;
}

export interface StorageEntityKey {
  datacenter: KeyPart;
  grandParent: KeyPart;
  parent: KeyPart;
  child: KeyPart;
}

export interface ComponentKey {
  parentName: string;
  grandParentName: string;
  childName: string;
}

@UseInterceptors(LoggingInterceptor)
@Controller('api/v1/')
export class MetricController {
  constructor(private singleValueCollector: MetricCollectorService,
              private multiValueCollector: MultiValueMetricCollectorService) {
  }

  // @Post([
  //   ':subComponent/:systemName/metrics',
  //   'systems/:systemName/:subComponent/:subComponentName/metrics',
  //   'systems/:systemName/chas/:subComponentName/:subComponent/:portName/metrics',
  // ])
  // async insertMetric(
  //   @Param('systemName') systemName: string,
  //   @Param('subComponent') subComponentType: CollectorType,
  //   @Param('subComponentName') subComponentName: string,
  //   @Param('portName') portName: string,
  //   @Body(new MetricTypePipe()) dto: MetricRequestDto): Promise<MetricResponseDto> {
  //   const componentKey = MetricController.createComponentKey(systemName, subComponentName, portName, this.resolveKeyType(subComponentType));
  //   const metricEntity = await this.collectorService.collectMetric(componentKey, dto);
  //   return MetricTransformer.transform(metricEntity);
  //   //return this.factory.getTransformer(subComponentType).transform(metricEntity);
  // }

  @Post([
    ':subComponent/:systemName/metrics',
    'systems/:systemName/:subComponent/:subComponentName/metrics',
    'systems/:systemName/chas/:subComponentName/:subComponent/:portName/metrics',
  ])
  async insertSimpleMetric(
    @Param('systemName') systemName: string,
    @Param('subComponent') subComponentType: CollectorType,
    @Param('subComponentName') subComponentName: string,
    @Param('portName') portName: string,
    @Body(new MetricRequestPipe()) dto: MetricRequestDto) {
    const metricEntity = await this.collectMetric(this.singleValueCollector, systemName, subComponentType, subComponentName, portName, dto);
    return MetricTransformer.transform(metricEntity[0]);
  }

  @Post('systems/:systemName/pools/:subComponentName/latencyPerBlockSize')
  async insertMultiValueMetric(
    @Param('systemName') systemName: string,
    @Param('subComponentName') subComponentName: string,
    @Body(new MetricRequestPipe()) dto: MetricRequestDto) {
    const entities = await this.collectMetric(this.multiValueCollector, systemName, CollectorType.LATENCY, subComponentName, undefined, dto);
    console.log(LatencyMetricTransformer.transform(entities as unknown as LatencyEntity[]));
  }

  async collectMetric(collector: AbstractMetricCollectorService, systemName: string, type, subComponentName, portName, dto) {
    const componentKey = MetricController.createComponentKey(systemName, subComponentName, portName, this.resolveKeyType(type));
    const metricEntity = await collector.collectMetric(componentKey, dto);
    return metricEntity;
  }

  // @Put([
  //   ':subComponent/:systemName/status',
  //   'systems/:systemName/:subComponent/:subComponentName/status',
  //   'systems/:systemName/chas/:subComponentName/:subComponent/:portName/status',
  // ])
  // async changeStatus(
  //   @Param('systemName') systemName: string,
  //   @Param('subComponent') subComponentType: CollectorType,
  //   @Param('subComponentName') subComponentName: string,
  //   @Param('portName') portName: string,
  //   @Body() dto: ChangeStatusRequestDto,
  // ) {
  //   const componentService = this.storageEntityServiceFactory.getStorageEntityService(subComponentType);
  //   const componentKey = MetricController.createComponentKey(systemName, subComponentName, portName);
  //   return StorageEntityTransformer.transform(await componentService.changeStatusByName(componentKey, dto.status));
  // }

  private static createComponentKey(systemName, subComponentName, portName, paramType: StorageEntityType): StorageEntityKey {
    let componentKey: StorageEntityKey;
    if (portName !== undefined) {
      componentKey = {
        datacenter: { name: 'CZ_Chodov', type: StorageEntityType.DATA_CENTER },
        grandParent: { name: systemName, type: StorageEntityType.SYSTEM },
        parent: { name: subComponentName, type: StorageEntityType.ADAPTER },
        child: { name: portName, type: paramType },
      };
    } else if (subComponentName !== undefined) {
      componentKey = {
        datacenter: { name: 'CZ_Chodov', type: StorageEntityType.DATA_CENTER },
        grandParent: null,
        parent: { name: systemName, type: StorageEntityType.SYSTEM },
        child: { name: subComponentName, type: paramType },
      };
    } else {
      componentKey = {
        datacenter: { name: 'CZ_Chodov', type: StorageEntityType.DATA_CENTER },
        grandParent: null,
        parent: null,
        child: { name: systemName, type: paramType },
      };
    }
    return componentKey;
  }

  private resolveKeyType(type: CollectorType): StorageEntityType {
    switch (type) {
      case CollectorType.HOST_GROUPS:
        return StorageEntityType.HOST_GROUP;
      case CollectorType.POOLS:
        return StorageEntityType.POOL;
      case CollectorType.CHAS:
        return StorageEntityType.ADAPTER;
      case CollectorType.SYSTEMS:
        return StorageEntityType.SYSTEM;
      case CollectorType.PORTS:
        return StorageEntityType.PORT;
      case CollectorType.LATENCY:
        return StorageEntityType.POOL;
      default:
        throw new NotFoundException(`Cannot resolve Storage entity type \'${type}\'`);
    }
  }
}
