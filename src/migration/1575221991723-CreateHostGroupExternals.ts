import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHostGroupExternals1575221991723 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    return await queryRunner.query(`
CREATE TABLE cat_external_type (
	id_cat_external_type SERIAL PRIMARY KEY,
	name VARCHAR(20)
);

INSERT INTO cat_external_type(id_cat_external_type, name)
VALUES(1, 'TIER');

CREATE TABLE externals (
	id_external SERIAL PRIMARY KEY,
	id_cat_external_type INTEGER REFERENCES cat_external_type(id_cat_external_type),
	value VARCHAR(50),
	id_host_group INTEGER REFERENCES host_groups(id_host_group)
);
`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return;
  }

}
