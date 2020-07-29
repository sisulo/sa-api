import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDisbalanceAbsolutUnit1575317549047 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    return await queryRunner.query(`
UPDATE cat_metric_type
SET unit = 'MBps'
WHERE id_cat_metric_type IN (36,49,60)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return;
  }

}
