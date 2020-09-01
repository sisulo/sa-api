import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('system_details')
export class SystemDetailEntity {
  @PrimaryColumn({ name: 'id_storage_entity', type: 'integer' })
  id: number;
  @Column({ name: 'model' })
  model: string;
  @Column({ name: 'dkc' })
  dkc: string;
  @Column({ name: 'management_ip' })
  managementIp: string;
  @Column({ name: 'rack' })
  rack: string;
  @Column({ name: 'room' })
  room: string;
  @Column({ name: 'prefix_reference_id' })
  prefixReferenceId: string;
  @Column({ name: 'sort_id' })
  sortId: number;
}
