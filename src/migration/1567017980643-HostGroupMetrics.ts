import { MigrationInterface, QueryRunner } from 'typeorm';

export class HostGroupMetrics1567017980643 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {

    queryRunner.query(`
CREATE TABLE host_groups
(
    id_host_group    SERIAL PRIMARY KEY,
    name       text                                   NOT NULL,
    id_system  INTEGER REFERENCES systems (id_system) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE host_group_metrics
(
    id_host_group_metric     SERIAL PRIMARY KEY,
    id_cat_metric_type SMALLINT REFERENCES cat_metric_type (id_cat_metric_type) NOT NULL,
    id_host_group       INTEGER REFERENCES pools (id_pool)                       NOT NULL,
    value              FLOAT,
    date               DATE                                                     NOT NULL,
    created_at         TIMESTAMP DEFAULT NOW()
);
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return;
  }

}
