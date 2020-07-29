import { MigrationInterface, QueryRunner } from 'typeorm';

import * as fs from 'fs';

export class AddedSerialNumberToStorageEntities1586771660274 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    // await queryRunner.query(`
    //   ALTER TABLE systems ADD COLUMN serial_number VARCHAR(30);
    //   ALTER TABLE pools ADD COLUMN serial_number VARCHAR(30);
    //   `);
    // // TODO remove before commit and fix all scripts
    // return await queryRunner.query(fs.readFileSync(__dirname + '/../../database/migrate_to_storage_enity.sql').toString());
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return;
  }

}
