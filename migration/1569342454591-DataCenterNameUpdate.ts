import { MigrationInterface, QueryRunner } from 'typeorm';

export class DataCenterNameUpdate1569342454591 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`
        UPDATE datacenters
SET name='MY_Cyberjaya'
WHERE id_datacenter=3;
        `);
    queryRunner.query(`UPDATE datacenters
SET name='US_Mechanicsburg'
WHERE id_datacenter=6;`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return;
  }

}
