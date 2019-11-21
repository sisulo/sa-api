import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CatMetricTypeEntity } from './cat-metric-type.entity';
import { MetricEntityInterface } from './metric-entity.interface';
import { PortEntity } from './port.entity';

@Entity('port_metrics')
export class PortMetricEntity implements MetricEntityInterface {
  @PrimaryGeneratedColumn({ name: 'id_port_metric' })
  id: number;

  @Column({ name: 'value' })
  value: number;

  @Column('date', { name: 'date' })
  date: Date;

  @ManyToOne(() => CatMetricTypeEntity, { eager: true })
  @JoinColumn({ name: 'id_cat_metric_type' })
  metricTypeEntity: CatMetricTypeEntity;

  @ManyToOne(() => PortEntity, port => port.metrics, { eager: true })
  @JoinColumn({ name: 'id_port' })
  port: PortEntity;
}
