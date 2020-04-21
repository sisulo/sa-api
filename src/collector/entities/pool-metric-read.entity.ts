import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { StorageEntityEntity } from './storage-entity.entity';

@Entity('view_pool_metrics')
export class PoolMetricReadEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  value: number;

  @Column({name: 'id_cat_metric_type'})
  idType: number;

  @Column()
  date: Date;

  @ManyToOne(() => StorageEntityEntity, storageEntity => storageEntity.id, { eager: true })
  @JoinColumn({ name: 'id_storage_entity' })
  owner: StorageEntityEntity;
}
