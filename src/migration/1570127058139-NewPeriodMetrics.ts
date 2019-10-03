import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewPeriodMetrics1570127058139 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(41,'WORKLOAD_MONTH', 'IOPS', 1);
INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(42,'RESPONSE_MONTH', 'ms', 1);
INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(43,'TRANSFER_MONTH', 'MBps', 1);
INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(44,'HDD_PERC_MONTH', '%', 1);
INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(45,'CPU_PERC_MONTH', '%', 1);
INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(46,'WRITE_PENDING_PERC_MONTH', '%', 1);
INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(47,'DISBALANCE_EVENTS_MONTH', null, 3);
INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(48,'DISBALANCE_PERC_MONTH', '%', 3);
INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(49,'DISBALANCE_ABSOLUT_MONTH', null, 3);
INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(50,'SLA_EVENTS_MONTH', null, 4);
INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(51,'OUT_OF_SLA_TIME_MONTH','s', 4);

INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(52,'WORKLOAD_WEEK', 'IOPS', 1);
INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(53,'RESPONSE_WEEK', 'ms', 1);
INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(54,'TRANSFER_WEEK', 'MBps', 1);
INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(55,'HDD_PERC_WEEK', '%', 1);
INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(56,'CPU_PERC_WEEK', '%', 1);
INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(57,'WRITE_PENDING_PERC_WEEK', '%', 1);
INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(58,'DISBALANCE_EVENTS_WEEK', null, 3);
INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(59,'DISBALANCE_PERC_WEEK', '%', 3);
INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(60,'DISBALANCE_ABSOLUT_WEEK', null, 3);
INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(61,'SLA_EVENTS_WEEK', null, 4);
INSERT INTO cat_metric_type(id_cat_metric_type, name, unit, id_cat_metric_group) VALUES(62,'OUT_OF_SLA_TIME_WEEK','s', 4);
SELECT setval('cat_metric_type_id_cat_metric_type_seq', 62);
`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
  }

}
