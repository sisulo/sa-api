import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewPortMetricTypes1575831856441 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`INSERT INTO cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group)
                  VALUES(63, 'PORT_DISBALANCE_EVENTS', NULL, 2),
                  (64, 'PORT_DISBALANCE_PERC', '%', 2),
                  (65, 'PORT_DISBALANCE_ABSOLUT', 'MBps', 2),
                  (66, 'PORT_DISBALANCE_EVENTS_WEEK', NULL, 2),
                  (67, 'PORT_DISBALANCE_PERC_WEEK', '%', 2),
                  (68, 'PORT_DISBALANCE_ABSOLUT_WEEK', 'MBps', 2),
                  (69, 'PORT_DISBALANCE_EVENTS_MONTH', NULL, 2),
                  (70, 'PORT_DISBALANCE_PERC_MONTH', '%', 2),
                  (71, 'PORT_DISBALANCE_ABSOLUT_MONTH', 'MBps', 2);
        UPDATE port_metrics
        SET id_cat_metric_type = 63
        WHERE id_cat_metric_type = 15;
        UPDATE port_metrics
        SET id_cat_metric_type = 64
        WHERE id_cat_metric_type = 35;
        UPDATE port_metrics
        SET id_cat_metric_type = 65
        WHERE id_cat_metric_type = 36;
        UPDATE port_metrics
        SET id_cat_metric_type = 66
        WHERE id_cat_metric_type = 58;
        UPDATE port_metrics
        SET id_cat_metric_type = 67
        WHERE id_cat_metric_type = 59;
        UPDATE port_metrics
        SET id_cat_metric_type = 68
        WHERE id_cat_metric_type = 60;
        UPDATE port_metrics
        SET id_cat_metric_type = 69
        WHERE id_cat_metric_type = 47;
        UPDATE port_metrics
        SET id_cat_metric_type = 70
        WHERE id_cat_metric_type = 48;
        UPDATE port_metrics
        SET id_cat_metric_type = 71
        WHERE id_cat_metric_type = 49;
        INSERT INTO metric_thresholds(id_cat_metric_type, min_value, max_value)
        VALUES(63, 1, NULL);
                  `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return;
  }

}
