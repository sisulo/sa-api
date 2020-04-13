import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SystemEntity } from './system.entity';
import { StorageEntityInterface } from './storage-entity.interface';

@Entity('datacenters')
export class DataCenterEntity implements StorageEntityInterface {

  @PrimaryGeneratedColumn({ name: 'id_datacenter' })
  id: number;

  @Column({ name: 'name' })
  name: string;

  idCatComponentStatus: number;

  @OneToMany(() => SystemEntity, system => system.parent)
  systems: SystemEntity[];

  parent: StorageEntityInterface;
}
