import { Injectable, Scope } from '@nestjs/common';
import { ApiCollectorFactory } from './api-collector-factory.interface';
import { CollectorFactory } from './collector-factory.interface';
import { CollectorType } from './collector-type.enum';

@Injectable({ scope: Scope.DEFAULT })
export class MetricServiceFactoryImpl implements ApiCollectorFactory {

  getCollector(type: CollectorType): CollectorFactory<any> {
    return undefined;
  }

}
