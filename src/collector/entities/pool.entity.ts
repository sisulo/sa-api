import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pools')
export class PoolEntity {

  @PrimaryGeneratedColumn({ name: 'id_pool', type: 'integer' })
  idPool: number;

  @Column({ name: 'name' })
  name: string;

  @Column({name: 'id_system'})
  idSystem: number;

}
