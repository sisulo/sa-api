import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SystemEntity } from './system.entity';
import { ChaMetricEntity } from './cha-metric.entity';

@Entity('chas')
export class ChaEntity {

  @PrimaryGeneratedColumn({ name: 'id_cha' })
  idCha: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'id_system' })
  idSystem: number;

  @ManyToOne(type => SystemEntity)
  @JoinColumn({name: 'id_system'})
  system: SystemEntity;

  @OneToMany(type => ChaMetricEntity, metric => metric.adapter)
  metrics: ChaMetricEntity[];
}
