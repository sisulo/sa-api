import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pool_metrics')
export class PoolMetricEntity {
  @PrimaryGeneratedColumn({name: 'id_pool_metric'})
  id: string;

  @Column({name: 'id_cat_metric_type'})
  idMetricType: number;

  @Column({name: 'value'})
  value: string;

  @Column({name: 'date'})
  date: Date;

  @Column({name: 'id_pool'})
  idPool: number;

  @Column({name: 'id_system'})
  idSystem: number;
}
