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

  @ManyToOne(() => PortEntity, port => port.id, { eager: true })
  @JoinColumn({ name: 'id_port' })
  owner: PortEntity;

  @Column('date', { name: 'date' })
  date: Date;

  @ManyToOne(() => CatMetricTypeEntity, { eager: true })
  @JoinColumn({ name: 'id_cat_metric_type' })
  metricTypeEntity: CatMetricTypeEntity;
}
