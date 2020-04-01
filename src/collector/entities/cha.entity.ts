import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SystemEntity } from './system.entity';
import { ChaMetricReadEntity } from './cha-metric-read.entity';
import { PortEntity } from './port.entity';
import { StorageEntityInterface } from './storage-entity.interface';

@Entity('chas')
export class ChaEntity implements StorageEntityInterface {

  @PrimaryGeneratedColumn({ name: 'id_cha' })
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'id_cat_component_status' })
  idCatComponentStatus: number;

  @ManyToOne(() => SystemEntity, { eager: true })
  @JoinColumn({ name: 'id_system' })
  parent: SystemEntity;

  @OneToMany(() => ChaMetricReadEntity, metric => metric.owner)
  metrics: ChaMetricReadEntity[];

  @OneToMany(() => PortEntity, port => port.parent)
  ports: PortEntity[];
}
