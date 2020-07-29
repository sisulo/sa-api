import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';

export class CapacityStatsViewChanged1566330284798 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(fs.readFileSync(__dirname + '/../../database/views.sql').toString());
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return;
  }

}
