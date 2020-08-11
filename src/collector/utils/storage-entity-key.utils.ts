import { StorageEntityType } from '../dto/owner.dto';
import { CollectorType } from '../factory/collector-type.enum';
import { NotFoundException } from '@nestjs/common';

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

export class StorageEntityKeyUtils {
  public static createComponentKey(systemName, subComponentName, portName, paramType: StorageEntityType): StorageEntityKey {
    let componentKey: StorageEntityKey;
    if (portName !== undefined && portName !== null) {
      componentKey = {
        datacenter: { name: 'CZ_Chodov', type: StorageEntityType.DATACENTER },
        grandParent: { name: systemName, type: StorageEntityType.SYSTEM },
        parent: { name: subComponentName, type: StorageEntityType.ADAPTER },
        child: { name: portName, type: paramType },
      };
    } else if (subComponentName !== undefined) {
      componentKey = {
        datacenter: { name: 'CZ_Chodov', type: StorageEntityType.DATACENTER },
        grandParent: null,
        parent: { name: systemName, type: StorageEntityType.SYSTEM },
        child: { name: subComponentName, type: paramType },
      };
    } else {
      componentKey = {
        datacenter: { name: 'CZ_Chodov', type: StorageEntityType.DATACENTER },
        grandParent: null,
        parent: null,
        child: { name: systemName, type: paramType },
      };
    }
    return componentKey;
  }

  public static of(type: CollectorType): StorageEntityType {
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
