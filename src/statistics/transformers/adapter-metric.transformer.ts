import { SystemDetail } from '../models/SystemDetail';
import { SystemMetric } from '../models/metrics/SystemMetric';
import { DataCenterEntity } from '../../collector/entities/data-center.entity';
import { SystemEntity } from '../../collector/entities/system.entity';
import { SystemPool } from '../models/SystemPool';
import { ChaEntity } from '../../collector/entities/cha.entity';
import { ChaMetricEntity } from '../../collector/entities/cha-metric.entity';
import { DatacenterCapacityListDto } from '../models/dtos/datacenter-capacity-list.dto';
import { CapacityStatisticsDto } from '../models/dtos/capacity-statistics.dto';
import { SystemMetricType } from '../models/metrics/SystemMetricType';
import { PortMetricEntity } from '../../collector/entities/port-metric.entity';
import { PortEntity } from '../../collector/entities/port.entity';

export class AdapterMetricTransformer {
  public static async transform(dataCenterPromise: DataCenterEntity[]): Promise<DatacenterCapacityListDto> {
    const response = new DatacenterCapacityListDto();
    dataCenterPromise.forEach(dataCenter => {
      const dto = new CapacityStatisticsDto();
      dto.id = dataCenter.id;
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
    systemPool.id = system.id;
    systemPool.name = system.name;
    systemPool.pools = system.adapters.map(
      pool => AdapterMetricTransformer.createPoolDetails(pool),
    );
    return systemPool;
  }

  private static createPoolDetails(pool: ChaEntity): SystemDetail {
    const poolDetails: SystemDetail = new SystemDetail();
    poolDetails.id = pool.id;
    poolDetails.name = pool.name;
    if (pool.metrics != null) {
      poolDetails.metrics = pool.metrics.map(
        metric => AdapterMetricTransformer.createSystemMetric(metric),
      );
    } else {
      poolDetails.metrics = [];
    }
    poolDetails.ports = pool.ports.map(
      port => AdapterMetricTransformer.createPortDetails(port),
    );
    return poolDetails;
  }

  private static createSystemMetric(metric: ChaMetricEntity | PortMetricEntity) {
    const metricDetail = new SystemMetric();
    metricDetail.date = metric.date;
    metricDetail.type = metric.metricTypeEntity.name.replace(/(_WEEK)|(_MONTH)$/, '') as SystemMetricType;
    metricDetail.unit = metric.metricTypeEntity.unit;
    metricDetail.value = metric.value;
    return metricDetail;
  }

  private static createPortDetails(port: PortEntity) {
    const detail = new SystemDetail();
    detail.id = port.id;
    detail.name = port.name;
    if (port.metrics != null) {
      detail.metrics = port.metrics.map(
        metric => AdapterMetricTransformer.createSystemMetric(metric),
      );
    } else {
      detail.metrics = [];
    }
    return detail;
  }

}
