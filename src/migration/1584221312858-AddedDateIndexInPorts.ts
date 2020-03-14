import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedDateIndexInPorts1584221312858 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    return await queryRunner.query(`
        CREATE INDEX idx_port_metrics_date
    ON public.port_metrics USING btree
    (id_port ASC NULLS LAST, id_cat_metric_type ASC NULLS LAST, date DESC NULLS FIRST)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
  }

}
