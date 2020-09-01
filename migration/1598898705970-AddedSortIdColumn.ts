import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedSortIdColumn1598898705970 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE system_details ADD COLUMN sort_id SMALLINT;`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return ;
  }

}
