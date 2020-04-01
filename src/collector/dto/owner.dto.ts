export enum StorageEntityType {
  SYSTEM,
  POOL,
  ADAPTER,
  PORT,
  HOST_GROUP,
}

export class Owner {
  id: number;
  name: string;
  type: string;
  status: string;
  parent: Owner;
}
