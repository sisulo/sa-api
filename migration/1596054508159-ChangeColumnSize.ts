import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeColumnSize1596054508159 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
            ALTER TABLE system_details ALTER COLUMN rack TYPE VARCHAR(32);
            ALTER TABLE system_details ALTER COLUMN room TYPE VARCHAR(32);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {

    return;
  }

}
