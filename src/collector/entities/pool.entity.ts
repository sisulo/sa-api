import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SystemEntity } from './system.entity';
import { PoolMetricReadEntity } from './pool-metric-read.entity';

@Entity('pools')
export class PoolEntity {

  @PrimaryGeneratedColumn({ name: 'id_pool', type: 'integer' })
  idPool: number;

  @Column({ name: 'name' })
  name: string;

  @ManyToOne(() => SystemEntity, { eager: true })
  @JoinColumn({ name: 'id_system' })
  system: SystemEntity;

  @OneToMany(() => PoolMetricReadEntity, metric => metric.pool)
  metrics: PoolMetricReadEntity[];

}
