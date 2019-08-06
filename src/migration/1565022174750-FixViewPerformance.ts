import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixViewPerformance1565022174750 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
    CREATE OR REPLACE VIEW public.view_pool_metrics AS
        SELECT outer_sm.id_pool_metric,
            outer_sm.id_cat_metric_type,
            outer_sm.value,
            outer_sm.id_pool,
            outer_sm.date,
            outer_sm.created_at
           FROM datacenters
             JOIN systems ON systems.id_datacenter = datacenters.id_datacenter
             JOIN pools ON systems.id_system = pools.id_system
             LEFT JOIN pool_metrics outer_sm ON outer_sm.id_pool = pools.id_pool AND (outer_sm.id_pool_metric = ( SELECT inner_sm.id_pool_metric
                   FROM pool_metrics inner_sm
                  WHERE outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type AND outer_sm.id_pool = inner_sm.id_pool
                  ORDER BY inner_sm.date DESC
                 LIMIT 1)
         )`);
    await queryRunner.query(`
    CREATE OR REPLACE VIEW view_cha_metrics as
    SELECT
         outer_sm.id_cha_metric,
         outer_sm.id_cat_metric_type,
         outer_sm.value,
         outer_sm.id_cha,
         outer_sm.date,
         outer_sm.created_at
    FROM datacenters
    JOIN systems ON systems.id_datacenter = datacenters.id_datacenter
    JOIN chas ON systems.id_system = chas.id_system
    LEFT JOIN cha_metrics outer_sm ON outer_sm.id_cha = chas.id_cha
        AND outer_sm.id_cha_metric = (
            SELECT inner_sm.id_cha_metric
            FROM cha_metrics as inner_sm
            WHERE outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type
                AND outer_sm.id_cha = inner_sm.id_cha
            ORDER BY outer_sm.date DESC
            LIMIT 1
        );`);
    await queryRunner.query(`
    CREATE OR REPLACE VIEW view_system_metrics AS
    SELECT outer_sm.id_system_metric,
         outer_sm.id_cat_metric_type,
         outer_sm.value,
         outer_sm.peak,
         outer_sm.id_system,
         outer_sm.date,
         outer_sm.created_at
    FROM  datacenters
         JOIN systems
           ON systems.id_datacenter = datacenters.id_datacenter
         LEFT JOIN system_metrics outer_sm  ON outer_sm.id_system = systems.id_system
            AND outer_sm.id_system_metric =
           (
            SELECT inner_sm.id_system_metric
            FROM system_metrics AS inner_sm
            WHERE outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type
               AND outer_sm.id_system = inner_sm.id_system
            ORDER BY date DESC
            LIMIT 1
            );
    `);
    await queryRunner.query(`CREATE INDEX idx_pool_metrics_id_pool_metric_type
    ON public.pool_metrics USING btree
    (id_pool, id_cat_metric_type)
    INCLUDE(id_pool_metric)`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
  }

}
