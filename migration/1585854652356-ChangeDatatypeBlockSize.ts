import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeDatatypeBlockSize1585854652356 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    return await queryRunner.query(`ALTER TABLE block_size_latency ALTER COLUMN block_size TYPE FLOAT;`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return;
  }

}
