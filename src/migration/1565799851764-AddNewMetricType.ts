import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewMetricType1565799851764 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(
        `INSERT INTO cat_metric_type (id_cat_metric_type, name, unit, id_cat_metric_group)
                  VALUES(37, 'SUBSCRIBED_CAPACITY', 'TB', 2),
                  (38, 'LOGICAL_SUBS_PERC', '%', 2),
                  (39, 'NET_SUBS_PERC', '%', 2),
                  (40, 'NET_USED_PERC', '%', 2);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
  }

}
