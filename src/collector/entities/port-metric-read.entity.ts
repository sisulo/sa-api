import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CatMetricTypeEntity } from './cat-metric-type.entity';
import { MetricEntityInterface } from './metric-entity.interface';
import { PortEntity } from './port.entity';
import { StorageEntityEntity } from './storage-entity.entity';

@Entity('view_port_metrics')
export class PortMetricReadEntity implements MetricEntityInterface {
  @PrimaryGeneratedColumn({ name: 'id_port_metric', type: 'integer' })
  id: number;

  @Column({ name: 'value' })
  value: number;

  @ManyToOne(() => StorageEntityEntity, storageEntity => storageEntity.id, { eager: true })
  @JoinColumn({ name: 'id_storage_entity' })
  owner: StorageEntityEntity;

  @Column('date', { name: 'date' })
  date: Date;

  @Column({ name: 'id_cat_metric_type', type: 'integer' })
  idType: number;

  @ManyToOne(() => CatMetricTypeEntity, { eager: true })
  @JoinColumn({ name: 'id_cat_metric_type' })
  metricTypeEntity: CatMetricTypeEntity;
}
