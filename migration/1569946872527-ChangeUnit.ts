import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUnit1569946872527 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      UPDATE cat_metric_type
      SET unit = 'MBps'
      WHERE id_cat_metric_type=9;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return;
  }

}
