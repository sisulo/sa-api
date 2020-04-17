import { Body, Controller, NotFoundException, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { MetricRequestDto } from '../dto/metric-request.dto';
import { CollectorType } from '../factory/collector-type.enum';
import { LoggingInterceptor } from '../../logging.interceptor';
import { MetricRequestPipe } from '../dto/pipes/metric-request-pipe.service';
import { StorageEntityType } from '../dto/owner.dto';
import { MetricCollectorService } from '../services/collect/metric-collector.service';
import { MetricTransformer } from '../transformers/metric.transformer';
import { LatencyMetricTransformer } from '../transformers/latency-metric.transformer';
import { LatencyEntity } from '../entities/latency.entity';
import { MultiValueMetricCollectorService } from '../services/collect/multi-value-metric-collector.service';
import { AbstractMetricCollectorService } from '../services/collect/abstract-metric-collector.service';
import { ChangeStatusRequestDto } from '../dto/change-status-request.dto';
import { StorageEntityTransformer } from '../transformers/storage-entity.transformer';
import { StorageEntityService } from '../services/storage-entity.service';
import { StorageEntityResponseDto } from '../dto/storage-entity-response.dto';
import { StorageEntityStatusPipe } from '../dto/pipes/storage-entity-status.pipe';

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
              private multiValueCollector: MultiValueMetricCollectorService,
              private storageEntityService: StorageEntityService) {
  }

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
    return LatencyMetricTransformer.transform(entities as unknown as LatencyEntity[]);
  }

  async collectMetric(collector: AbstractMetricCollectorService, systemName: string, type, subComponentName, portName, dto) {
    const componentKey = MetricController.createComponentKey(systemName, subComponentName, portName, this.resolveKeyType(type));
    const metricEntity = await collector.collectMetric(componentKey, dto);
    return metricEntity;
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
    @Body(new StorageEntityStatusPipe()) dto: ChangeStatusRequestDto,
  ): Promise<StorageEntityResponseDto> {
    const componentKey = MetricController.createComponentKey(systemName, subComponentName, portName, this.resolveKeyType(subComponentType));
    const storageEntity = await this.storageEntityService.updateStatus(componentKey, dto);
    return StorageEntityTransformer.transform(storageEntity);
  }

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
