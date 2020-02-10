import { Injectable } from '@nestjs/common';
import { LatencyMetricService } from '../../collector/services/latency-metric.service';
import { OperationType } from '../../collector/enums/operation-type.enum';
import { ArrayUtils } from '../utils/array.utils';
import { PoolEntity } from '../../collector/entities/pool.entity';
import { PoolService } from '../../collector/services/pool.service';

export interface OperationData {
  values: ThreeDimensionValue[];
  operation: OperationType;
}

export interface ThreeDimensionValue {
  x: number;
  y: number;
  z: number;
}

export interface LatencyMetadata {
  dates: string[]; // Instead of date string is used because locale didn't set correctly
  pools: Array<Partial<PoolEntity>>;
}

@Injectable()
export class LatencyBlockSizeService {
  constructor(
    private readonly service: LatencyMetricService,
    private readonly poolService: PoolService,
  ) {
  }

  private static mapEntity(data: any[], key: OperationType): OperationData {
    return {
      operation: key,
      values: LatencyBlockSizeService.mapValues(data),
    };

  }

  private static mapValues(data: any[]): ThreeDimensionValue[] {
    return data.map(
      item => {
        return { x: item.blockSize, y: item.latency, z: item.count } as ThreeDimensionValue;
      },
    );
  }

  public async frequencyByLatencyBlockSize(poolIds: number[], dates: Date[], operations: OperationType[]): Promise<OperationData[]> {
    const entities = await this.service.frequencyByLatencyBlockSize(poolIds, dates, operations);
    const groupedBy = ArrayUtils.groupBy(entities, 'operation');
    return operations.map(
      operation => LatencyBlockSizeService.mapEntity(groupedBy[operation] || [], operation),
    );
  }

  public async getMetaData(): Promise<LatencyMetadata> {
    const datesValues = await this.service.availableDates();
    const poolsValues = await this.poolService.availablePools();
    return { dates: datesValues, pools: poolsValues };
  }
}
