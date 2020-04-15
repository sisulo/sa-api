import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { HostGroupEntity } from './host-group.entity';
import { AbstractMetricEntity } from './abstract-metric.entity';

@Entity('host_group_metrics')
export class HostGroupMetricEntity extends AbstractMetricEntity {
}
