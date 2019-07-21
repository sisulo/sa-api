import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cat_metric_type')
export class CatMetricTypeEntity {
  @PrimaryGeneratedColumn({ name: 'id_cat_metric_type', type: 'integer' })
  idCatMetricType: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'unit' })
  unit: string;

  @Column({ name: 'id_cat_metric_group' })
  idCatMetricGroup: number;
}
