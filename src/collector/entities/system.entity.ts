import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { DataCenterEntity } from './data-center.entity';
import { SystemMetricEntity } from './system-metric.entity';

@Entity('systems')
export class SystemEntity {

  @PrimaryGeneratedColumn({ name: 'id_system' })
  idSystem: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'id_datacenter' })
  idDataCenter: number;

  @ManyToOne(type => DataCenterEntity)
  @JoinColumn({name: 'id_datacenter'})
  datacenter: DataCenterEntity;

  @OneToMany(type => SystemMetricEntity, metric => metric.system)
  metrics: SystemMetricEntity[];
}
