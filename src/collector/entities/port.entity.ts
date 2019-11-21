import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PortMetricReadEntity } from './port-metric-read.entity';
import { ChaEntity } from './cha.entity';

@Entity('ports')
export class PortEntity {

  @PrimaryGeneratedColumn({ name: 'id_port' })
  idPort: number;

  @Column({ name: 'name' })
  name: string;

  @ManyToOne(() => ChaEntity, { eager: true })
  @JoinColumn({ name: 'id_cha' })
  system: ChaEntity;

  @OneToMany(() => PortMetricReadEntity, metric => metric.port)
  metrics: PortMetricReadEntity[];
}
