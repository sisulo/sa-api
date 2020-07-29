import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';

export class InitDatabase1564589174189 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(fs.readFileSync(__dirname + '/../init.sql').toString());
    await queryRunner.query(fs.readFileSync(__dirname + '/../catalogs.sql').toString());
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return;
  }

}
