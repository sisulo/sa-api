import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMetricTypeNames1576082953690 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    return await queryRunner.query(`
        UPDATE cat_metric_type
        SET name = REPLACE(name, 'DISBALANCE', 'IMBALANCE')
        WHERE name LIKE '%DISBALANCE%'
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return;
  }

}
