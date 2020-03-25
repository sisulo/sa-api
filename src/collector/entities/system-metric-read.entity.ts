import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SystemEntity } from './system.entity';
import { CatMetricTypeEntity } from './cat-metric-type.entity';
import { MetricEntityInterface } from './metric-entity.interface';

// TODO move to statistics
// TODO Make a view_metric_active for all "Read" Entity
@Entity('view_system_metrics')
export class SystemMetricReadEntity implements MetricEntityInterface {
  @PrimaryGeneratedColumn({ name: 'id_system_metric', type: 'integer' })
  id: number;

  @Column({ name: 'value' })
  value: number;

  @Column({ name: 'peak' })
  peak: number;

  @ManyToOne(() => SystemEntity, system => system.id, { eager: true })
  @JoinColumn({ name: 'id_system' })
  owner: SystemEntity;

  @Column('date', { name: 'date' })
  date: Date;

  @ManyToOne(() => CatMetricTypeEntity, { eager: true })
  @JoinColumn({ name: 'id_cat_metric_type' })
  metricTypeEntity: CatMetricTypeEntity;
}
