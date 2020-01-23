import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cat_operation')
export class CatOperationEntity {
  @PrimaryGeneratedColumn({ name: 'id_cat_operation', type: 'integer' })
  idCatOperation: number;

  @Column({ name: 'name' })
  name: string;
}
