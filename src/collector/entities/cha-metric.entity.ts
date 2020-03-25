import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ChaEntity } from './cha.entity';
import { MetricEntityInterface } from './metric-entity.interface';
import { AbstractMetricEntity } from './abstract-metric.entity';

@Entity('cha_metrics')
export class ChaMetricEntity extends AbstractMetricEntity implements MetricEntityInterface {

  @ManyToOne(() => ChaEntity, { eager: true })
  @JoinColumn({ name: 'id_cha' })
  owner: ChaEntity;
}
