import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedHostGroupView1567711254258 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`
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
         LEFT JOIN host_group_metrics outer_sm ON outer_sm.id_host_group = host_groups.id_host_group AND outer_sm.id_host_group = ((
            SELECT inner_sm.id_host_group
               FROM host_group_metrics inner_sm
              WHERE outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type AND outer_sm.id_host_group = inner_sm.id_host_group
              ORDER BY inner_sm.date DESC
             LIMIT 1));
      SELECT setval('pools_id_pool_seq', (SELECT MAX(id_pool) from pools));
      SELECT setval('systems_id_system_seq', (SELECT MAX(id_system) from systems));
      SELECT setval('chas_id_cha_seq', (SELECT MAX(id_cha) from chas));
`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return;
  }

}
