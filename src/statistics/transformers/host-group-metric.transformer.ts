import { SystemDetail } from '../models/SystemDetail';
import { SystemMetric } from '../models/metrics/SystemMetric';
import { DataCenterEntity } from '../../collector/entities/data-center.entity';
import { SystemEntity } from '../../collector/entities/system.entity';
import { CapacityStatisticsDto } from '../models/dtos/capacity-statistics.dto';
import { SystemPool } from '../models/SystemPool';
import { HostGroupEntity } from '../../collector/entities/host-group.entity';
import { HostGroupMetricEntity } from '../../collector/entities/host-group-metric.entity';
import { DatacenterCapacityListDto } from '../models/dtos/datacenter-capacity-list.dto';
import { SystemMetricType } from '../models/metrics/SystemMetricType';
import { ExternalEntity } from '../../collector/entities/external.entity';
import { ComponentExternal } from '../models/ComponentExternal';

export class HostGroupMetricTransformer {
  // TODO CapacityStatisticsDto should be named as Composite stats not as type of metrics
  public static async transform(dataCenterPromise: DataCenterEntity[]): Promise<DatacenterCapacityListDto> {
    const response = new DatacenterCapacityListDto();
    dataCenterPromise.forEach(
      dataCenter => {

        const dto = new CapacityStatisticsDto();
        dto.id = dataCenter.id;
        dto.name = dataCenter.name;
        if (dataCenter.systems != null) {
          dto.systems = dataCenter.systems.map(
            system => HostGroupMetricTransformer.createSystemPool(system),
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
    systemPool.id = system.id;
    systemPool.name = system.name;
    systemPool.pools = system.hostGroups.map(
      pool => HostGroupMetricTransformer.createPoolDetails(pool),
    );
    return systemPool;
  }

  private static createPoolDetails(pool: HostGroupEntity): SystemDetail {
    const poolDetails: SystemDetail = new SystemDetail();
    poolDetails.id = pool.id;
    poolDetails.name = pool.name;
    if (pool.metrics != null) {
      poolDetails.metrics = pool.metrics.map(
        metric => HostGroupMetricTransformer.createSystemMetric(metric),
      );
    } else {
      poolDetails.metrics = [];
    }
    poolDetails.externals = HostGroupMetricTransformer.createExternals(pool.externals);
    return poolDetails;
  }

  private static createSystemMetric(metric: HostGroupMetricEntity) {
    const metricDetail = new SystemMetric();
    metricDetail.date = metric.date;
    // TODO do it as resolve function
    metricDetail.type = metric.metricTypeEntity.name as SystemMetricType;
    metricDetail.unit = metric.metricTypeEntity.unit;
    metricDetail.value = metric.value;
    return metricDetail;
  }

  private static createExternals(externals: ExternalEntity[]): ComponentExternal[] {
    if (externals !== undefined && externals.length > 0) {
      return externals.map(
        external => HostGroupMetricTransformer.createExternal(external),
      );
    }
    return [];
  }

  private static createExternal(external: ExternalEntity) {
    const responseDto = new ComponentExternal();
    responseDto.type = SystemMetricType[external.externalTypeEntity.name];
    responseDto.value = external.value;
    return responseDto;
  }
}
