import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrderInViewFix1571070561168 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`drop view IF EXISTS view_cha_metrics;
    create view view_cha_metrics as
    select
         outer_sm.id_cha_metric,
         outer_sm.id_cat_metric_type,
         outer_sm.value,
         outer_sm.id_cha,
         outer_sm.date,
         outer_sm.created_at
    from datacenters
    join systems on systems.id_datacenter = datacenters.id_datacenter
    join chas on systems.id_system = chas.id_system
    left join cha_metrics outer_sm on chas.id_system = systems.id_system
    and outer_sm.id_cha = chas.id_cha and outer_sm.id_cha_metric in (
    select inner_sm.id_cha_metric
    from cha_metrics as inner_sm
    where outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type
        and outer_sm.id_cha = inner_sm.id_cha
    order by inner_sm.date desc
    limit 1
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return;
  }

}
