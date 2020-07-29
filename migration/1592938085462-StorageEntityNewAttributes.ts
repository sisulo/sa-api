import { MigrationInterface, QueryRunner } from 'typeorm';

export class StorageEntityNewAttributes1592938085462 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    return await queryRunner.query(`
    CREATE TABLE system_details
(
    id_storage_entity INTEGER PRIMARY KEY REFERENCES storage_entities(id),
    model             VARCHAR(15),
    prefix_reference_id VARCHAR(10),
    dkc               VARCHAR(30),
    management_ip     VARCHAR(20),
    rack              VARCHAR(10),
    room              VARCHAR(10)
);
CREATE UNIQUE INDEX IX_id_storage_entity ON system_details (id_storage_entity);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
  }

}
