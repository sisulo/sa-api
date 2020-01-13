import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterViewHostGroupMetrics1578944987537 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
    CREATE OR REPLACE VIEW public.view_host_group_metrics AS
        SELECT outer_sm.id_host_group_metric,
        outer_sm.id_cat_metric_type,
        outer_sm.value,
        outer_sm.id_host_group,
        outer_sm.date,
        outer_sm.created_at
       FROM datacenters
         JOIN systems ON systems.id_datacenter = datacenters.id_datacenter
         JOIN host_groups ON systems.id_system = host_groups.id_system
         LEFT JOIN host_group_metrics outer_sm ON outer_sm.id_host_group = host_groups.id_host_group AND outer_sm.id_host_group_metric = ((
            SELECT inner_sm.id_host_group_metric
               FROM host_group_metrics inner_sm
              WHERE outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type AND outer_sm.id_host_group = inner_sm.id_host_group
              ORDER BY inner_sm.date DESC
             LIMIT 1));
`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
  }

}
