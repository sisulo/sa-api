import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PortMetricReadEntity } from './port-metric-read.entity';
import { ChaEntity } from './cha.entity';
import { StorageEntityInterface } from './storage-entity.interface';

@Entity('ports')
export class PortEntity implements StorageEntityInterface {

  @PrimaryGeneratedColumn({ name: 'id_port' })
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({name: 'id_cat_component_status'})
  idCatComponentStatus: number;

  @ManyToOne(() => ChaEntity, { eager: true })
  @JoinColumn({ name: 'id_cha' })
  parent: ChaEntity;

  @OneToMany(() => PortMetricReadEntity, metric => metric.owner)
  metrics: PortMetricReadEntity[];
}
