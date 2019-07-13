import { SystemDetail } from './dto/models/SystemDetail';
import { SystemMetric } from './dto/models/metrics/SystemMetric';
import { DataCenterEntity } from '../collector/entities/data-center.entity';
import { SystemEntity } from '../collector/entities/system.entity';
import { CapacityStatisticsDto } from './dto/models/dtos/CapacityStatisticsDto';
import { SystemPool } from './dto/models/SystemPool';
import { PoolEntity } from '../collector/entities/pool.entity';
import { PoolMetricEntity } from '../collector/entities/pool-metric.entity';

export class CapacityMetricTransformer {
  public static async transform(dataCenterPromise: DataCenterEntity): Promise<CapacityStatisticsDto> {
    const response = new CapacityStatisticsDto();
    const dataCenter = await dataCenterPromise;
    response.id = dataCenter.idDatacenter;
    response.name = dataCenter.name;
    if (dataCenter.systems != null) {

      response.systems = dataCenter.systems.map(
        system => CapacityMetricTransformer.createSystemPool(system),
      );
    } else {
      response.systems = [];
    }
    return response;
  }

  private static createSystemPool(system: SystemEntity): SystemPool {
    const systemPool = new SystemPool();
    systemPool.id = system.idSystem;
    systemPool.name = system.name;
    if (system.pools != null) {
      systemPool.pools = system.pools.map(
        pool => CapacityMetricTransformer.createPoolDetails(pool),
      );
    } else {
      systemPool.pools = [];
    }
    return systemPool;
  }

  private static createPoolDetails(pool: PoolEntity): SystemDetail {
    const poolDetails: SystemDetail = new SystemDetail();
    poolDetails.id = pool.idPool;
    poolDetails.name = pool.name;
    if (pool.metrics != null) {
      poolDetails.metrics = pool.metrics.map(
        metric => CapacityMetricTransformer.createSystemMetric(metric),
      );
    } else {
      poolDetails.metrics = [];
    }
    return poolDetails;
  }

  private static createSystemMetric(metric: PoolMetricEntity) {
    const metricDetail = new SystemMetric();
    metricDetail.date = metric.date;
    metricDetail.type = metric.metricTypeEntity.name;
    metricDetail.unit = metric.metricTypeEntity.unit;
    metricDetail.value = parseFloat(metric.value);
    return metricDetail;
  }

}
