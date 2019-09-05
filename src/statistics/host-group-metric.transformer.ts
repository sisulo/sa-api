import { SystemDetail } from './models/SystemDetail';
import { SystemMetric } from './models/metrics/SystemMetric';
import { DataCenterEntity } from '../collector/entities/data-center.entity';
import { SystemEntity } from '../collector/entities/system.entity';
import { CapacityStatisticsDto } from './models/dtos/CapacityStatisticsDto';
import { SystemPool } from './models/SystemPool';
import { HostGroupEntity } from '../collector/entities/host-group.entity';
import { HostGroupMetricEntity } from '../collector/entities/host-group-metric.entity';

export class HostGroupMetricTransformer {
  // TODO CapacityStatisticsDto should be named as Composite stats not as type of metrics
  public static async transform(dataCenterPromise: DataCenterEntity): Promise<CapacityStatisticsDto> {
    const response = new CapacityStatisticsDto();
    const dataCenter = await dataCenterPromise;
    response.id = dataCenter.idDatacenter;
    response.name = dataCenter.name;
    if (dataCenter.systems != null) {
      response.systems = dataCenter.systems.map(
        system => HostGroupMetricTransformer.createSystemPool(system),
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
    systemPool.pools = system.hostGroups.map(
      pool => HostGroupMetricTransformer.createPoolDetails(pool),
    );
    return systemPool;
  }

  private static createPoolDetails(pool: HostGroupEntity): SystemDetail {
    const poolDetails: SystemDetail = new SystemDetail();
    poolDetails.id = pool.idHostGroup;
    poolDetails.name = pool.name;
    if (pool.metrics != null) {
      poolDetails.metrics = pool.metrics.map(
        metric => HostGroupMetricTransformer.createSystemMetric(metric),
      );
    } else {
      poolDetails.metrics = [];
    }
    return poolDetails;
  }

  private static createSystemMetric(metric: HostGroupMetricEntity) {
    const metricDetail = new SystemMetric();
    metricDetail.date = metric.date;
    metricDetail.type = metric.metricTypeEntity.name;
    metricDetail.unit = metric.metricTypeEntity.unit;
    metricDetail.value = metric.value;
    return metricDetail;
  }

}
