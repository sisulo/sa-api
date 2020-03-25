import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SystemEntity } from './system.entity';
import { HostGroupMetricReadEntity } from './host-group-metric-read.entity';
import { ExternalEntity } from './external.entity';
import { StorageEntityInterface } from './storage-entity.interface';

@Entity('host_groups')
export class HostGroupEntity implements StorageEntityInterface {

  @PrimaryGeneratedColumn({ name: 'id_host_group', type: 'integer' })
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'id_cat_component_status' })
  idCatComponentStatus: number;

  @ManyToOne(() => SystemEntity, { eager: true })
  @JoinColumn({ name: 'id_system' })
  system: SystemEntity;

  @OneToMany(() => HostGroupMetricReadEntity, metric => metric.owner)
  metrics: HostGroupMetricReadEntity[];

  @OneToMany(() => ExternalEntity, external => external.hostGroup, {
    cascade: true,
    eager: true,
  })
  externals: ExternalEntity[];

}
