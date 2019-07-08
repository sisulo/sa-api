import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MetricTypeTransformer } from '../transformers/metric-type.transformer';
import { MetricType } from '../enums/metric-type.enum';
import { CatMetricTypeEntity } from './cat-metric-type.entity';

@Entity('pool_metrics')
export class PoolMetricEntity {
  @PrimaryGeneratedColumn({name: 'id_pool_metric'})
  id: string;

  @Column({ name: 'id_cat_metric_type', transformer: MetricTypeTransformer })
  metricType: MetricType;

  @Column({name: 'value'})
  value: string;

  @Column({name: 'date'})
  date: Date;

  @Column({name: 'id_pool'})
  idPool: number;

  @Column({name: 'id_system'})
  idSystem: number;

  @ManyToOne(type => CatMetricTypeEntity)
  @JoinColumn({name: 'id_cat_metric_type'})
  metricTypeEntity: CatMetricTypeEntity;
}
