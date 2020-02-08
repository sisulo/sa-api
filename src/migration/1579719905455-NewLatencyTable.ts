import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewLatencyTable1579719905455 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
        CREATE TABLE cat_operation (
            id_cat_operation SERIAL PRIMARY KEY,
            name VARCHAR(10)
        );
        INSERT INTO cat_operation (id_cat_operation, name)
        VALUES (1, 'READ'),
        (2, 'WRITE');

        CREATE TABLE block_size_latency (
            id_block_size_latency SERIAL PRIMARY KEY,
            id_cat_metric_type INTEGER REFERENCES cat_metric_type(id_cat_metric_type) NOT NULL,
            id_pool INTEGER REFERENCES pools(id_pool) NOT NULL,
            id_cat_operation INTEGER REFERENCES cat_operation(id_cat_operation) NOT NULL,
            block_size INTEGER NOT NULL,
            latency FLOAT NOT NULL,
            count INTEGER NOT NULL,
            date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );
        -- INDEX
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return;
  }

}
