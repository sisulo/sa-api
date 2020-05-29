import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';

export class MaterializedViews1590697019456 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    return await queryRunner.query(fs.readFileSync(__dirname + '/../../database/init.sql').toString());
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return;
  }

}
