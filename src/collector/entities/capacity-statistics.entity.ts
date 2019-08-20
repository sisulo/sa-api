import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CatMetricTypeEntity } from './cat-metric-type.entity';

@Entity('view_weighted_average_capacity')
export class CapacityStatisticsEntity {

  @PrimaryColumn({ name: 'id_cat_metric_type' })
  idCatMetricType: number;

  @ManyToOne(() => CatMetricTypeEntity, { eager: true })
  @JoinColumn({ name: 'id_cat_metric_type' })
  metricTypeEntity: CatMetricTypeEntity;

  @Column({ name: 'value' })
  value: number;
}
