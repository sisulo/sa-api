import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MetricEntityInterface } from './metric-entity.interface';
import { PortEntity } from './port.entity';
import { AbstractMetricEntity } from './abstract-metric.entity';

@Entity('port_metrics')
export class PortMetricEntity extends AbstractMetricEntity implements MetricEntityInterface {
}
