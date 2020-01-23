import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewCatMetricType1579723172512 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
        INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group)
        VALUES(72, 'LATENCY_PER_BLOCK_SIZE', NULL, 2);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
  }

}
