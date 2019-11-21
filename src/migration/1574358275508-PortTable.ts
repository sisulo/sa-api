import { MigrationInterface, QueryRunner } from 'typeorm';

export class PortTable1574358275508 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
        CREATE TABLE ports (
            id_port    SERIAL PRIMARY KEY,
            name       text                                   NOT NULL,
            id_cha  INTEGER REFERENCES chas (id_cha) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );
        CREATE TABLE port_metrics(
            id_port_metric     SERIAL PRIMARY KEY,
            id_cat_metric_type SMALLINT REFERENCES cat_metric_type (id_cat_metric_type) NOT NULL,
            id_port            INTEGER REFERENCES ports (id_port)                       NOT NULL,
            value              FLOAT,
            date               DATE                                                     NOT NULL,
            created_at         TIMESTAMP DEFAULT NOW()
        );
        CREATE INDEX idx_port_metrics_id_metric_type
            ON public.port_metrics USING btree
            (id_port, id_cat_metric_type)
            INCLUDE(id_port_metric);

        DROP VIEW IF EXISTS view_pool_metrics;
        CREATE VIEW view_port_metrics as
        SELECT
             outer_sm.id_port_metric,
             outer_sm.id_cat_metric_type,
             outer_sm.value,
             outer_sm.id_port,
             outer_sm.date,
             outer_sm.created_at
        FROM datacenters
        JOIN systems ON systems.id_datacenter = datacenters.id_datacenter
        JOIN chas ON systems.id_system = chas.id_system
        JOIN ports ON chas.id_cha = ports.id_cha
        LEFT JOIN port_metrics outer_sm ON outer_sm.id_port = ports.id_port AND outer_sm.id_port_metric IN (
            SELECT inner_sm.id_port_metric
            FROM port_metrics as inner_sm
            WHERE outer_sm.id_cat_metric_type = inner_sm.id_cat_metric_type
                and outer_sm.id_port = inner_sm.id_port
            ORDER BY date DESC
            LIMIT 1
        );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return;
  }

}
