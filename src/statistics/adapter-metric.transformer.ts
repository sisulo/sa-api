import { SystemDetail } from './dto/models/SystemDetail';
import { SystemMetric } from './dto/models/metrics/SystemMetric';
import { DataCenterEntity } from '../collector/entities/data-center.entity';
import { SystemEntity } from '../collector/entities/system.entity';
import { CapacityStatisticsDto } from './dto/models/dtos/CapacityStatisticsDto';
import { SystemPool } from './dto/models/SystemPool';
import { ChaEntity } from '../collector/entities/cha.entity';
import { ChaMetricEntity } from '../collector/entities/cha-metric.entity';

export class AdapterMetricTransformer {
  public static async transform(dataCenterPromise: DataCenterEntity): Promise<CapacityStatisticsDto> {
    const response = new CapacityStatisticsDto();
    const dataCenter = await dataCenterPromise;
    response.id = dataCenter.idDatacenter;
    response.name = dataCenter.name;
    if (dataCenter.systems != null) {
      response.systems = dataCenter.systems.map(
        system => AdapterMetricTransformer.createSystemPool(system),
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
    systemPool.pools = system.adapters.map(
      pool => AdapterMetricTransformer.createPoolDetails(pool),
    );
    return systemPool;
  }

  private static createPoolDetails(pool: ChaEntity): SystemDetail {
    const poolDetails: SystemDetail = new SystemDetail();
    poolDetails.id = pool.idCha;
    poolDetails.name = pool.name;
    if (pool.metrics != null) {
      poolDetails.metrics = pool.metrics.map(
        metric => AdapterMetricTransformer.createSystemMetric(metric),
      );
    } else {
      poolDetails.metrics = [];
    }
    return poolDetails;
  }

  private static createSystemMetric(metric: ChaMetricEntity) {
    const metricDetail = new SystemMetric();
    metricDetail.date = metric.date;
    metricDetail.type = metric.metricTypeEntity.name;
    metricDetail.unit = metric.metricTypeEntity.unit;
    metricDetail.value = parseFloat(metric.value);
    return metricDetail;
  }

}
