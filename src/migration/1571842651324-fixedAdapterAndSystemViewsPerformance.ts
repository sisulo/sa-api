import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixedAdapterAndSystemViewsPerformance1571842651324 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE INDEX idx_cha_metrics_id_cha_metric_type
    ON public.cha_metrics USING btree
    (id_cha, id_cat_metric_type)
    INCLUDE(id_cha_metric);`);
    await queryRunner.query(`CREATE INDEX idx_host_group_metrics_id_cha_metric_type
    ON public.host_group_metrics USING btree
    (id_host_group, id_cat_metric_type)
    INCLUDE(id_host_group_metric);`);
    await queryRunner.query(`CREATE INDEX idx_system_metrics_id_cat_metric_type
    ON public.system_metrics USING btree
    (id_system, id_cat_metric_type)
    INCLUDE(id_system_metric);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
  }

}
