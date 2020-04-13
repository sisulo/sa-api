import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SystemEntity } from './system.entity';
import { PoolMetricReadEntity } from './pool-metric-read.entity';
import { StorageEntityInterface } from './storage-entity.interface';

@Entity('pools')
export class PoolEntity implements StorageEntityInterface {

  @PrimaryGeneratedColumn({ name: 'id_pool', type: 'integer' })
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({name: 'id_cat_component_status'})
  idCatComponentStatus: number;

  @Column({name: 'serial_number'})
  serialNumber: string;

  @ManyToOne(() => SystemEntity, { eager: true })
  @JoinColumn({ name: 'id_system' })
  parent: SystemEntity;

  @OneToMany(() => PoolMetricReadEntity, metric => metric.owner)
  metrics: PoolMetricReadEntity[];

}
