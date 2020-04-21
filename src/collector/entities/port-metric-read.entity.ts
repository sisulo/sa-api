import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { StorageEntityEntity } from './storage-entity.entity';

@Entity('view_port_metrics')
export class PortMetricReadEntity {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'value' })
  value: number;

  @Column('date', { name: 'date' })
  date: Date;

  @Column({ name: 'id_cat_metric_type', type: 'integer' })
  idType: number;

  @ManyToOne(() => StorageEntityEntity, storageEntity => storageEntity.id, { eager: true })
  @JoinColumn({ name: 'id_storage_entity' })
  owner: StorageEntityEntity;

  metrics: any[];
}
