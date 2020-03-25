import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DataCenterEntity } from './data-center.entity';
import { SystemMetricReadEntity } from './system-metric-read.entity';
import { PoolEntity } from './pool.entity';
import { ChaEntity } from './cha.entity';
import { HostGroupEntity } from './host-group.entity';
import { StorageEntityInterface } from './storage-entity.interface';

@Entity('systems')
export class SystemEntity implements StorageEntityInterface{

  @PrimaryGeneratedColumn({ name: 'id_system' })
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'id_cat_component_status' })
  idCatComponentStatus: number;

  @Column({ name: 'id_datacenter' })
  idDataCenter: number;

  @ManyToOne(() => DataCenterEntity)
  @JoinColumn({ name: 'id_datacenter' })
  datacenter: DataCenterEntity;

  @OneToMany(() => SystemMetricReadEntity, metric => metric.owner)
  metrics: SystemMetricReadEntity[];

  @OneToMany(() => PoolEntity, pool => pool.system)
  pools: PoolEntity[];

  @OneToMany(() => ChaEntity, adapter => adapter.system)
  adapters: ChaEntity[];

  @OneToMany(() => HostGroupEntity, hostGroup => hostGroup.system)
  hostGroups: HostGroupEntity[];
}
