import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PoolEntity } from './pool.entity';
import { CatOperationEntity } from './cat-operation.entity';
import { AbstractMetricEntity } from './abstract-metric.entity';

@Entity('block_size_latency')
export class LatencyEntity extends AbstractMetricEntity {

  @Column({ name: 'block_size' })
  blockSize: number;

  @Column({ name: 'latency' })
  latency: number;

  @Column({ name: 'id_cat_operation' })
  idOperation: number;

}
