import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SystemEntity } from './system.entity';
import { CatMetricTypeEntity } from './cat-metric-type.entity';

@Entity('system_metrics')
export class SystemMetricEntity {
  @PrimaryGeneratedColumn({ name: 'id_system_metric', type: 'integer' })
  id: number;

  @Column({ name: 'value' })
  value: number;

  @Column({ name: 'peak' })
  peak: number;

  @Column({ name: 'id_system' })
  idSystem: number;

  @ManyToOne(() => SystemEntity, system => system.idSystem, { eager: true })
  @JoinColumn({ name: 'id_system' })
  system: SystemEntity;

  @Column('date', { name: 'date' })
  date: Date;

  @ManyToOne(() => CatMetricTypeEntity, { eager: true })
  @JoinColumn({ name: 'id_cat_metric_type' })
  metricTypeEntity: CatMetricTypeEntity;
}
