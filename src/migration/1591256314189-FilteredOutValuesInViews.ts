import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';

export class FilteredOutValuesInViews1591256314189 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
     DROP MATERIALIZED VIEW view_cha_metrics;
DROP MATERIALIZED VIEW view_port_metrics;
DROP MATERIALIZED VIEW view_pool_metrics;
DROP MATERIALIZED VIEW view_system_metrics;
DROP MATERIALIZED VIEW view_host_group_metrics;
     `);
    return await queryRunner.query(fs.readFileSync(__dirname + '/../../database/views.sql').toString());
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return;
  }

}
