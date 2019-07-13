import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MetricType } from '../enums/metric-type.enum';
import { MetricTypeTransformer } from '../transformers/metric-type.transformer';
import { SystemEntity } from './system.entity';
import { CatMetricTypeEntity } from './cat-metric-type.entity';

@Entity('system_metrics')
export class SystemMetricEntity {
  @PrimaryGeneratedColumn({ name: 'id_system_metric', type: 'integer' })
  idSystemMetric: string;

  @Column({ name: 'value', length: 100 })
  value: string;

  @Column({ name: 'peak' })
  peak: number;

  @Column({ name: 'id_system' })
  idSystem: number;

  @ManyToOne(() => SystemEntity, system => system.idSystem)
  @JoinColumn({ name: 'id_system' })
  system: SystemEntity;

  @Column('date', { name: 'date' })
  date: Date;

  @Column({ name: 'id_cat_metric_type', transformer: MetricTypeTransformer })
  metricType: MetricType; // Todo remove and use entity

  @ManyToOne(() => CatMetricTypeEntity)
  @JoinColumn({ name: 'id_cat_metric_type' })
  metricTypeEntity: CatMetricTypeEntity;
}
