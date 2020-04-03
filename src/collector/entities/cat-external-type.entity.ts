import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// TODO Replace by enumerators
@Entity('cat_external_type')
export class CatExternalTypeEntity {
  @PrimaryGeneratedColumn({ name: 'id_cat_external_type', type: 'integer' })
  idCatExternalType: number;

  @Column({ name: 'name' })
  name: string;

}
