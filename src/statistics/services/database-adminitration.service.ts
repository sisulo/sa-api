import { getConnection } from 'typeorm';
import { Logger } from '@nestjs/common';

export class DatabaseAdminitrationService {

  private readonly logger = new Logger(DatabaseAdminitrationService.name);

  public async refreshMaterializedViews() {
    this.logger.log('Materialized views is refreshing');
    const connection = getConnection();

    connection.createQueryRunner().query(`
    REFRESH MATERIALIZED VIEW view_system_metrics;
    REFRESH MATERIALIZED VIEW view_pool_metrics;
    REFRESH MATERIALIZED VIEW view_host_group_metrics;
    REFRESH MATERIALIZED VIEW view_cha_metrics;
    REFRESH MATERIALIZED VIEW view_port_metrics;
    `).then(
      () => this.logger.log('Materialized views refreshed'),
    ).finally(
      () => connection.close(),
    );

  }
}
