import { CollectorType } from './collector-type.enum';
import { CollectorFactory } from './collector-factory.interface';

export interface ApiCollectorFactory {
  getCollector(type: CollectorType): CollectorFactory;
}
