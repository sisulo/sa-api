import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chas')
export class ChaEntity {

  @PrimaryGeneratedColumn({ name: 'id_cha' })
  idCha: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'id_system' })
  idSystem: number;

}
