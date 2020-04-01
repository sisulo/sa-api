import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeColumnNameBlockSizeLatency1585678977626 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`
        ALTER TABLE block_size_latency RENAME COLUMN id_block_size_latency TO id_metric;
        ALTER TABLE block_size_latency RENAME COLUMN count TO value;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return;
  }

}
