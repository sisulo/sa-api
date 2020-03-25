import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PoolEntity } from './pool.entity';
import { CatMetricTypeEntity } from './cat-metric-type.entity';
import { CatOperationEntity } from './cat-operation.entity';
import { AbstractMetricEntity } from './abstract-metric.entity';

@Entity('block_size_latency')
export class LatencyEntity extends AbstractMetricEntity {

  @PrimaryGeneratedColumn({ name: 'id_block_size_latency' })
  idBlockSizeLatency: number;

  @Column({ name: 'block_size' })
  blockSize: number;

  @Column({ name: 'latency' })
  latency: number;

  @Column({ name: 'count' })
  count: number;

  @Column('date', { name: 'date' })
  date: Date;

  @ManyToOne(() => CatOperationEntity, { eager: true })
  @JoinColumn({ name: 'id_cat_operation' })
  operationEntity: CatOperationEntity;

  @ManyToOne(() => CatMetricTypeEntity, { eager: true })
  @JoinColumn({ name: 'id_cat_metric_type' })
  metricTypeEntity: CatMetricTypeEntity;

  @ManyToOne(() => PoolEntity, { eager: true })
  @JoinColumn({ name: 'id_pool' })
  pool: PoolEntity;

}
