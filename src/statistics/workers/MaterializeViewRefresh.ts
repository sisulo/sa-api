import { Cron, Interval } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';
import { getConnection } from 'typeorm';

@Injectable()
export class MaterializeViewRefresh {
  private readonly logger = new Logger(MaterializeViewRefresh.name);

  @Cron('0 0 */2 * * *')
  public async refreshMaterializedViews() {
    this.logger.log('Materialized views is refreshing');
    await getConnection().createQueryRunner().query(`
    REFRESH MATERIALIZED VIEW view_system_metrics;
    REFRESH MATERIALIZED VIEW view_pool_metrics;
    REFRESH MATERIALIZED VIEW view_host_group_metrics;
    REFRESH MATERIALIZED VIEW view_cha_metrics;
    REFRESH MATERIALIZED VIEW view_port_metrics;
    `);
    this.logger.log('Materialized views refreshed');
  }
}
