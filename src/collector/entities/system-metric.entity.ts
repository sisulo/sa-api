import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SystemEntity } from './system.entity';
import { AbstractMetricEntity } from './abstract-metric.entity';

@Entity('system_metrics')
export class SystemMetricEntity extends AbstractMetricEntity {

  @Column({ name: 'peak' })
  peak: number;

  @ManyToOne(() => SystemEntity, system => system.id, { eager: true })
  @JoinColumn({ name: 'id_system' })
  owner: SystemEntity;
}
