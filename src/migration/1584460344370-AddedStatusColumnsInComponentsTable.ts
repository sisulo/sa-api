import { MigrationInterface, QueryRunner } from 'typeorm';
import addCustomEqualityTester = jasmine.addCustomEqualityTester;

export class AddedStatusColumnsInComponentsTable1584460344370 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`
         CREATE TABLE cat_component_status (
            id_cat_component_status SMALLINT PRIMARY KEY,
            name VARCHAR(15) NOT NULL
         );

INSERT INTO cat_component_status (id_cat_component_status, name)
VALUES(1, 'ACTIVE'),
(2, 'INACTIVE');

ALTER TABLE pools ADD COLUMN id_cat_component_status SMALLINT DEFAULT(1) REFERENCES cat_component_status(id_cat_component_status);
ALTER TABLE host_groups ADD COLUMN id_cat_component_status SMALLINT DEFAULT(1) REFERENCES cat_component_status(id_cat_component_status);
ALTER TABLE chas ADD COLUMN id_cat_component_status SMALLINT DEFAULT(1) REFERENCES cat_component_status(id_cat_component_status);
ALTER TABLE ports ADD COLUMN id_cat_component_status SMALLINT DEFAULT(1) REFERENCES cat_component_status(id_cat_component_status);
ALTER TABLE systems ADD COLUMN id_cat_component_status SMALLINT DEFAULT(1) REFERENCES cat_component_status(id_cat_component_status);

ALTER TABLE system_metrics RENAME COLUMN id_system_metric TO id_metric;
ALTER TABLE pool_metrics RENAME COLUMN id_pool_metric TO id_metric;
ALTER TABLE cha_metrics RENAME COLUMN id_cha_metric TO id_metric;
ALTER TABLE host_group_metrics RENAME COLUMN id_host_group_metric TO id_metric;
ALTER TABLE port_metrics RENAME COLUMN id_port_metric TO id_metric;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
  }

}
