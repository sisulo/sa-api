import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { SystemEntity } from './system.entity';

@Entity('datacenters')
export class DataCenterEntity {

  @PrimaryGeneratedColumn({ name: 'id_datacenter' })
  idDatacenter: number;

  @Column({ name: 'name' })
  name: string;

  @OneToMany(type => SystemEntity, system => system.datacenter)
  systems: SystemEntity[];
}
