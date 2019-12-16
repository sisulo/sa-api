import { EntityType } from './EntityType';

export class Occurrence {
  datacenterId: number;
  systemId: number;
  entityId: number;
  entityType: EntityType;
  middleEntityType: EntityType;
  middleEntityId: number;
  middleEntityName: string;
  name: string;
  value: number;
  unit: string;
  average: number;
}
