import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('view_weighted_average_capacity')
export class CapacityStatisticsEntity {

  @PrimaryColumn({ name: 'PHYSICAL_CAPACITY' })
  physicalCapacity: number;

  @Column({ name: 'AVAILABLE_CAPACITY' })
  availableCapacity: number;

  @Column({ name: 'PHYSICAL_SUBS_PERC' })
  physicalSubsPerc: number;

  @Column({ name: 'LOGICAL_USED_PERC' })
  logicalUsedPerc: number;

  @Column({ name: 'PHYSICAL_USED_PERC' })
  physicalUsedPerc: number;

  @Column({ name: 'COMPRESSION_RATIO' })
  compresionRatio: number;

  @Column({ name: 'PHYSICAL_USED' })
  physicalUsed: number;

  @Column({ name: 'PHYSICAL_FREE' })
  physicalFree: number;

  @Column({ name: 'LOGICAL_CAPACITY' })
  logicalCapacity: number;

  @Column({ name: 'LOGICAL_USED' })
  logicalUsed: number;

  @Column({ name: 'LOGICAL_FREE' })
  logicalFree: number;

  @Column({ name: 'NET_TOTAL' })
  netTotal: number;

  @Column({ name: 'NET_USED' })
  netUsed: number;

  @Column({ name: 'PHY_USED_BEF_SAVING' })
  phyUsedBefSaving: number;

  @Column({ name: 'DEDUP_RATIO' })
  dedupRatio: number;

  @Column({ name: 'LOGICAL_SUBS_PERC' })
  logicalSubsPerc: number;

  @Column({ name: 'NET_SUBS_PERC' })
  netSubsPerc: number;

  @Column({ name: 'NET_USED_PERC' })
  netUsedPerc: number;

}
