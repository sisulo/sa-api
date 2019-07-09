import { SystemDetail } from './dto/models/SystemDetail';
import { SystemMetric } from './dto/models/metrics/SystemMetric';
import { PerformanceStatisticsDto } from './dto/models/dtos/PerformanceStatisticsDto';
import { DataCenterEntity } from '../collector/entities/data-center.entity';
import { SystemMetricEntity } from '../collector/entities/system-metric.entity';
import { SystemEntity } from '../collector/entities/system.entity';
import { CapacityStatisticsDto } from './dto/models/dtos/CapacityStatisticsDto';
import { SystemPool } from './dto/models/SystemPool';
import { PoolEntity } from '../collector/entities/pool.entity';
import { PoolMetricEntity } from '../collector/entities/pool-metric.entity';
import { ChaEntity } from '../collector/entities/cha.entity';
import { ChaMetricEntity } from '../collector/entities/cha-metric.entity';

export class AdapterMetricTransformer {
  public static async transform(dataCenterPromise: Promise<DataCenterEntity>): Promise<CapacityStatisticsDto> {
    const response = new CapacityStatisticsDto();
    const dataCenter = await dataCenterPromise.then(entity => entity);
    response.id = dataCenter.idDatacenter;
    response.name = dataCenter.name;
    response.systems = dataCenter.systems.map(
      system => AdapterMetricTransformer.createSystemPool(system),
    );
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
    poolDetails.metrics = pool.metrics.map(
      metric => AdapterMetricTransformer.createSystemMetric(metric),
    );
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
