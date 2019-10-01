import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTresholds1569945015931 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`UPDATE metric_thresholds
        SET min_value=40
        WHERE id_cat_metric_type = 10;`);
    await queryRunner.query(`UPDATE metric_thresholds
        SET min_value=50
        WHERE id_cat_metric_type = 11;`);
    await queryRunner.query(`UPDATE metric_thresholds
        SET min_value=40
        WHERE id_cat_metric_type = 12;`);
    await queryRunner.query(`UPDATE metric_thresholds
        SET min_value=5
        WHERE id_cat_metric_type = 8;`);
    await queryRunner.query(
      `INSERT INTO metric_thresholds (id_cat_metric_type, min_value, max_value)
    VALUES (5, 88, NULL)`);

  }

  public async down(queryRunner: QueryRunner): Promise<any> {
  }

}
