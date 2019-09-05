import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SystemEntity } from './system.entity';
import { HostGroupMetricReadEntity } from './host-group-metric-read.entity';

@Entity('host_groups')
export class HostGroupEntity {

  @PrimaryGeneratedColumn({ name: 'id_host_group', type: 'integer' })
  idHostGroup: number;

  @Column({ name: 'name' })
  name: string;

  @ManyToOne(() => SystemEntity, { eager: true })
  @JoinColumn({ name: 'id_system' })
  system: SystemEntity;

  @OneToMany(() => HostGroupMetricReadEntity, metric => metric.hostGroup)
  metrics: HostGroupMetricReadEntity[];

}
