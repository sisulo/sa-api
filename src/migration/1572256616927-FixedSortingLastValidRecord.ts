import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixedSortingLastValidRecord1572256616927 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS public.idx_pool_metrics_date;
      CREATE INDEX idx_pool_metrics_date
    ON public.pool_metrics USING btree
    (id_pool, id_cat_metric_type, date DESC);`);
    await queryRunner.query(`
      DROP INDEX IF EXISTS public.idx_cha_metrics_date;
      CREATE INDEX idx_cha_metrics_date
    ON public.cha_metrics USING btree
    (id_cha, id_cat_metric_type, date DESC);`);
    await queryRunner.query(`
      DROP INDEX IF EXISTS public.idx_system_metrics_date;
      CREATE INDEX idx_system_metrics_date
    ON public.system_metrics USING btree
    (id_system, id_cat_metric_type, date DESC);`);
    await queryRunner.query(`
      DROP INDEX IF EXISTS public.idx_host_group_metrics_date;
      CREATE INDEX idx_host_group_metrics_date
    ON public.host_group_metrics USING btree
    (id_host_group, id_cat_metric_type, date DESC);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
  }

}
