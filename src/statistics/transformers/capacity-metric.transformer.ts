import { SystemDetail } from '../models/SystemDetail';
import { SystemMetric } from '../models/metrics/SystemMetric';
import { DataCenterEntity } from '../../collector/entities/data-center.entity';
import { SystemEntity } from '../../collector/entities/system.entity';
import { CapacityStatisticsDto } from '../models/dtos/capacity-statistics.dto';
import { SystemPool } from '../models/SystemPool';
import { PoolEntity } from '../../collector/entities/pool.entity';
import { PoolMetricEntity } from '../../collector/entities/pool-metric.entity';
import { DatacenterCapacityListDto } from '../models/dtos/datacenter-capacity-list.dto';
import { SystemMetricType } from '../models/metrics/SystemMetricType';
import { MetricType } from '../../collector/enums/metric-type.enum';

export class CapacityMetricTransformer {
  private static excludedMetric = [MetricType.CHANGE_DAY, MetricType.CHANGE_WEEK, MetricType.CHANGE_MONTH];

  public static async transform(dataCenterPromise: DataCenterEntity[]): Promise<DatacenterCapacityListDto> {
    const response = new DatacenterCapacityListDto();
    dataCenterPromise.forEach(
      dataCenter => {
        const dto = new CapacityStatisticsDto();
        dto.id = dataCenter.idDatacenter;
        dto.name = dataCenter.name;
        if (dataCenter.systems != null) {

          dto.systems = dataCenter.systems.map(
            system => CapacityMetricTransformer.createSystemPool(system),
          );
        } else {
          dto.systems = [];
        }
        response.datacenters.push(dto);
      },
    );

    return response;
  }

  public static createSystemPool(system: SystemEntity): SystemPool {
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
    if (CapacityMetricTransformer.excludedMetric.some(type => type === metric.metricTypeEntity.idCatMetricType)) {
      metricDetail.type = metric.metricTypeEntity.name as SystemMetricType;
    } else {
      metricDetail.type = metric.metricTypeEntity.name.replace(/(_WEEK)|(_MONTH)$/, '') as SystemMetricType;
    }
    metricDetail.unit = metric.metricTypeEntity.unit;
    metricDetail.value = metric.value;
    return metricDetail;
  }

}
