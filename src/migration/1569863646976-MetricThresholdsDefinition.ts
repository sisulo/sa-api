import { MigrationInterface, QueryRunner } from 'typeorm';

export class MetricThresholdsDefinition1569863646976 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE metric_thresholds (
                id_metric_threshold SERIAL PRIMARY KEY,
                id_cat_metric_type SMALLINT REFERENCES cat_metric_type(id_cat_metric_type),
                min_value FLOAT,
                max_value FLOAT
            );`,
    );
    await queryRunner.query(`
    INSERT INTO metric_thresholds (id_cat_metric_type, min_value, max_value)
    VALUES (10, 80, NULL),
    (11, 80, NULL),
    (12, 80, NULL),
    (8, 100, NULL),
    (15, 1, NULL),
    (13, 1, NULL);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
  }

}
