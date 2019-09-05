import { TransformationError } from './transformation.error';
import { serialize } from 'class-transformer';

export abstract class BaseTransformer {
  abstract transform(metric: any): any;

  assertNotNull(value: any, metric: any, entityType?: string, entityMetriType?: string) {
    if (value == null) {
      throw new TransformationError(`Missing ${entityType} in ${entityType} -> ${serialize(metric)}`);
    }
  }

}
