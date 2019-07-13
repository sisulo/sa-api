import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CatMetricTypeEntity } from './cat-metric-type.entity';
import { PoolEntity } from './pool.entity';

@Entity('pool_metrics')
export class PoolMetricEntity {
  @PrimaryGeneratedColumn({ name: 'id_pool_metric' })
  id: number;

  @Column({ name: 'value' })
  value: number;

  @Column({ name: 'date' })
  date: Date;

  @Column({ name: 'id_pool' })
  idPool: number;

  @Column({ name: 'id_system' })
  idSystem: number; // TODO remove idSystem from DB

  @ManyToOne(() => CatMetricTypeEntity)
  @JoinColumn({ name: 'id_cat_metric_type' })
  metricTypeEntity: CatMetricTypeEntity;

  @ManyToOne(() => PoolEntity, pool => pool.metrics, { eager: true })
  @JoinColumn({ name: 'id_pool' })
  pool: PoolEntity;
}
