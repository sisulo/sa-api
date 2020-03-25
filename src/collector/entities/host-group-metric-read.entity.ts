import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CatMetricTypeEntity } from './cat-metric-type.entity';
import { HostGroupEntity } from './host-group.entity';

@Entity('view_host_group_metrics')
export class HostGroupMetricReadEntity {

  @PrimaryGeneratedColumn({ name: 'id_host_group_metric' })
  id: number;

  @Column({ name: 'value' })
  value: number;

  @Column('date', { name: 'date' })
  date: Date;

  @ManyToOne(() => CatMetricTypeEntity, { eager: true })
  @JoinColumn({ name: 'id_cat_metric_type' })
  metricTypeEntity: CatMetricTypeEntity;

  @ManyToOne(() => HostGroupEntity, { eager: true })
  @JoinColumn({ name: 'id_host_group' })
  owner: HostGroupEntity;
}
