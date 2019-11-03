import { SystemDetail } from './models/SystemDetail';
import { SystemMetric } from './models/metrics/SystemMetric';
import { DataCenterEntity } from '../collector/entities/data-center.entity';
import { SystemEntity } from '../collector/entities/system.entity';
import { SystemPool } from './models/SystemPool';
import { ChaEntity } from '../collector/entities/cha.entity';
import { ChaMetricEntity } from '../collector/entities/cha-metric.entity';
import { DatacenterCapacityListDto } from './models/dtos/datacenter-capacity-list.dto';
import { CapacityStatisticsDto } from './models/dtos/capacity-statistics.dto';
import { SystemMetricType } from './models/metrics/SystemMetricType';

export class AdapterMetricTransformer {
  public static async transform(dataCenterPromise: DataCenterEntity[]): Promise<DatacenterCapacityListDto> {
    const response = new DatacenterCapacityListDto();
    dataCenterPromise.forEach(dataCenter => {
      const dto = new CapacityStatisticsDto();
      dto.id = dataCenter.idDatacenter;
      dto.name = dataCenter.name;
      if (dataCenter.systems != null) {
        dto.systems = dataCenter.systems.map(
          system => AdapterMetricTransformer.createSystemPool(system),
        );
      } else {
        dto.systems = [];
      }
      response.datacenters.push(dto);
    });
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
    metricDetail.type = metric.metricTypeEntity.name.replace(/(_WEEK)|(_MONTH)$/, '') as SystemMetricType;
    metricDetail.unit = metric.metricTypeEntity.unit;
    metricDetail.value = metric.value;
    return metricDetail;
  }

}
