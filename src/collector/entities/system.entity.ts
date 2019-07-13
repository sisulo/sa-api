import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DataCenterEntity } from './data-center.entity';
import { SystemMetricEntity } from './system-metric.entity';
import { PoolEntity } from './pool.entity';
import { ChaEntity } from './cha.entity';

@Entity('systems')
export class SystemEntity {

  @PrimaryGeneratedColumn({ name: 'id_system' })
  idSystem: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'id_datacenter' })
  idDataCenter: number;

  @ManyToOne(() => DataCenterEntity)
  @JoinColumn({name: 'id_datacenter'})
  datacenter: DataCenterEntity;

  @OneToMany(() => SystemMetricEntity, metric => metric.system)
  metrics: SystemMetricEntity[];

  @OneToMany(() => PoolEntity, pool => pool.system)
  pools: PoolEntity[];

  @OneToMany(() => ChaEntity, adapter => adapter.system)
  adapters: ChaEntity[];
}
