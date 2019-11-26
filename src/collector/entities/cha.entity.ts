import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SystemEntity } from './system.entity';
import { ChaMetricReadEntity } from './cha-metric-read.entity';
import { PortEntity } from './port.entity';

@Entity('chas')
export class ChaEntity {

  @PrimaryGeneratedColumn({ name: 'id_cha' })
  idCha: number;

  @Column({ name: 'name' })
  name: string;

  @ManyToOne(() => SystemEntity, { eager: true })
  @JoinColumn({ name: 'id_system' })
  system: SystemEntity;

  @OneToMany(() => ChaMetricReadEntity, metric => metric.adapter)
  metrics: ChaMetricReadEntity[];

  @OneToMany(() => PortEntity, port => port.system)
  ports: PortEntity[];
}
