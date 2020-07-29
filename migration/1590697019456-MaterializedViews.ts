import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';

export class MaterializedViews1590697019456 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
     DROP VIEW view_cha_metrics;
    DROP VIEW view_port_metrics;
    DROP VIEW view_pool_metrics;
    DROP VIEW view_system_metrics;
    DROP VIEW view_host_group_metrics;
    DROP VIEW view_cha_metrics;
     `);
    return await queryRunner.query(fs.readFileSync(__dirname + '/../../database/views.sql').toString());
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return;
  }

}
