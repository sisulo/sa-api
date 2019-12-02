import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CatExternalTypeEntity } from './cat-external-type.entity';
import { HostGroupEntity } from './host-group.entity';

@Entity('externals')
export class ExternalEntity {

  @PrimaryGeneratedColumn({ name: 'id_external', type: 'integer' })
  idExternal: number;

  @ManyToOne(() => CatExternalTypeEntity, { eager: true })
  @JoinColumn({ name: 'id_cat_external_type' })
  externalTypeEntity: CatExternalTypeEntity;

  @ManyToOne(() => HostGroupEntity, hostGroup => hostGroup.externals)
  @JoinColumn({ name: 'id_host_group' })
  hostGroup: HostGroupEntity;

  @Column({ name: 'value' })
  value: string;
}
