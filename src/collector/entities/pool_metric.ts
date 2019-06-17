import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PoolMetric')
export class PoolMetric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  value: string;

  @Column({ length: 100 })
  peak: string;

  @Column('int', { name: 'id_pool' })
  idPool: number;

  @Column('date')
  date: Date;

  @Column('int', { name: 'id_system_metric_type' })
  idMetricType: number;
}
