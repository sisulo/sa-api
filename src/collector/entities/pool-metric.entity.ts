import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PoolEntity } from './pool.entity';
import { MetricEntityInterface } from './metric-entity.interface';
import { AbstractMetricEntity } from './abstract-metric.entity';

@Entity('pool_metrics')
export class PoolMetricEntity extends AbstractMetricEntity implements MetricEntityInterface {

  @ManyToOne(() => PoolEntity, pool => pool.metrics, { eager: true })
  @JoinColumn({ name: 'id_pool' })
  owner: PoolEntity;
}
