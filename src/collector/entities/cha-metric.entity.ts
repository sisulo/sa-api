import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CatMetricTypeEntity } from './cat-metric-type.entity';
import { ChaEntity } from './cha.entity';
import { MetricEntityInterface } from './metric-entity.interface';

@Entity('cha_metrics')
export class ChaMetricEntity implements MetricEntityInterface {

  @PrimaryGeneratedColumn({ name: 'id_cha_metric' })
  id: number;

  @Column({ name: 'value' })
  value: number;

  @Column('date', { name: 'date' })
  date: Date;

  @ManyToOne(() => CatMetricTypeEntity, { eager: true })
  @JoinColumn({ name: 'id_cat_metric_type' })
  metricTypeEntity: CatMetricTypeEntity;

  @ManyToOne(() => ChaEntity, { eager: true })
  @JoinColumn({ name: 'id_cha' })
  adapter: ChaEntity;
}
