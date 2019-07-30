import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CatMetricTypeEntity } from './cat-metric-type.entity';
import { PoolEntity } from './pool.entity';

@Entity('view_pool_metrics')
export class PoolMetricReadEntity {
  @PrimaryGeneratedColumn({ name: 'id_pool_metric' })
  id: number;

  @Column({ name: 'value' })
  value: number;

  @Column('date', { name: 'date' })
  date: Date;

  @ManyToOne(() => CatMetricTypeEntity)
  @JoinColumn({ name: 'id_cat_metric_type' })
  metricTypeEntity: CatMetricTypeEntity;

  @ManyToOne(() => PoolEntity, pool => pool.metrics, { eager: true })
  @JoinColumn({ name: 'id_pool' })
  pool: PoolEntity;
}
