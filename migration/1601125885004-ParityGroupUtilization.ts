import { MigrationInterface, QueryRunner } from 'typeorm';

export class ParityGroupUtilization1601125885004 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO cat_storage_entity_type(id_cat_storage_entity_type, name) VALUES (7, 'PARITY_GROUP');

      CREATE TABLE parity_group_metrics (
          id_metric SERIAL,
          id_cat_metric_type SMALLINT REFERENCES cat_metric_type (id_cat_metric_type),
          value DOUBLE PRECISION,
          peak DOUBLE PRECISION,
          id_storage_entity INTEGER REFERENCES storage_entities (id),
          start_time TIMESTAMP,
          end_time TIMESTAMP
      );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return;
  }

}
