import { CollectorType } from './collector-type.enum';
import { CollectorGeneric } from './collectors/collector-generic';

export interface ApiCollectorFactory {
  getCollector(type: CollectorType): CollectorGeneric<any, any, any, any>;
}
