import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DataCenterEntity } from './data-center.entity';
import { SystemMetricReadEntity } from './system-metric-read.entity';
import { PoolEntity } from './pool.entity';
import { ChaEntity } from './cha.entity';
import { HostGroupEntity } from './host-group.entity';
import { StorageEntityInterface } from './storage-entity.interface';

@Entity('systems')
export class SystemEntity implements StorageEntityInterface {

  @PrimaryGeneratedColumn({ name: 'id_system' })
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'id_cat_component_status' })
  idCatComponentStatus: number;

  @Column({ name: 'id_datacenter' })
  parentId: number;

  @ManyToOne(() => DataCenterEntity)
  @JoinColumn({ name: 'id_datacenter' })
  parent: DataCenterEntity;

  @OneToMany(() => SystemMetricReadEntity, metric => metric.owner)
  metrics: SystemMetricReadEntity[];

  @OneToMany(() => PoolEntity, pool => pool.parent)
  pools: PoolEntity[];

  @OneToMany(() => ChaEntity, adapter => adapter.parent)
  adapters: ChaEntity[];

  @OneToMany(() => HostGroupEntity, hostGroup => hostGroup.parent)
  hostGroups: HostGroupEntity[];

}
