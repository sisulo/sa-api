/* tslint:disable:no-trailing-whitespace */
import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';

export class WeightedAverageView1565898659358 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    // await queryRunner.query(`CREATE extension tablefunc;`);
    await queryRunner.query(fs.readFileSync(__dirname + '/../../database/views.sql').toString());
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
  }

}
