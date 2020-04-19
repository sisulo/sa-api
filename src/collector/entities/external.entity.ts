import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { StorageEntityEntity } from './storage-entity.entity';

@Entity('externals')
export class ExternalEntity {

  @PrimaryGeneratedColumn({ name: 'id_external', type: 'integer' })
  idExternal: number;

  @Column( {name: 'id_cat_external_type'})
  idType: number;

  @ManyToOne(() => StorageEntityEntity, storageEntity => storageEntity.externals)
  @JoinColumn({ name: 'id_storage_entity' })
  storageEntity: StorageEntityEntity;

  @Column({ name: 'value' })
  value: string;
}
