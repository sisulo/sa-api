import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedSerialNumberToStorageEntities1586771660274 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    return await queryRunner.query(`
      ALTER TABLE systems ADD COLUMN serial_number VARCHAR(30);
      ALTER TABLE pools ADD COLUMN serial_number VARCHAR(30);
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return;
  }

}
