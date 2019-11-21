import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CatMetricTypeEntity } from './cat-metric-type.entity';
import { MetricEntityInterface } from './metric-entity.interface';
import { PortEntity } from './port.entity';

@Entity('view_port_metrics')
export class PortMetricReadEntity implements MetricEntityInterface {
  @PrimaryGeneratedColumn({ name: 'id_port_metric', type: 'integer' })
  id: number;

  @Column({ name: 'value' })
  value: number;

  @Column({ name: 'peak' })
  peak: number;

  @ManyToOne(() => PortEntity, port => port.idPort, { eager: true })
  @JoinColumn({ name: 'id_port' })
  port: PortEntity;

  @Column('date', { name: 'date' })
  date: Date;

  @ManyToOne(() => CatMetricTypeEntity, { eager: true })
  @JoinColumn({ name: 'id_cat_metric_type' })
  metricTypeEntity: CatMetricTypeEntity;
}
