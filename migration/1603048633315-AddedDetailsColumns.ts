import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedDetailsColumns1603048633315 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    return await queryRunner.query(`
      ALTER TABLE storage_entity_details
      ADD speed INT,
      ADD note VARCHAR(255),
      ADD cables VARCHAR(50),
      ADD switch VARCHAR(30),
      ADD slot VARCHAR(30),
      ADD wwn VARCHAR(100);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
