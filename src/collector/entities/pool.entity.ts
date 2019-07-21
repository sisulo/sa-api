import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SystemEntity } from './system.entity';
import { PoolMetricEntity } from './pool-metric.entity';

@Entity('pools')
export class PoolEntity {

  @PrimaryGeneratedColumn({ name: 'id_pool', type: 'integer' })
  idPool: number;

  @Column({ name: 'name' })
  name: string;

  @ManyToOne(() => SystemEntity, { eager: true })
  @JoinColumn({ name: 'id_system' })
  system: SystemEntity;

  @OneToMany(() => PoolMetricEntity, metric => metric.pool)
  metrics: PoolMetricEntity[];

}
