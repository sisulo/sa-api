import { SystemDetail } from './models/SystemDetail';
import { SystemMetric } from './models/metrics/SystemMetric';
import { PerformanceStatisticsDto } from './models/dtos/performance-statistics.dto';
import { DataCenterEntity } from '../collector/entities/data-center.entity';
import { SystemMetricEntity } from '../collector/entities/system-metric.entity';
import { SystemEntity } from '../collector/entities/system.entity';
import { DatacenterPerfListDto } from './models/dtos/datacenter-perf-list.dto';
import { SystemMetricType } from './models/metrics/SystemMetricType';

export class PerformanceMetricTransformer {
  private static suffixRegexp = new RegExp('/(_WEEK)|(_MONTH)$/').compile();
  public static async transform(dataCenterEntities: DataCenterEntity[]): Promise<DatacenterPerfListDto> {
    const response = new DatacenterPerfListDto();
    dataCenterEntities.forEach(datacenter => {
      const dto = new PerformanceStatisticsDto();
      dto.id = datacenter.idDatacenter;
      dto.label = datacenter.name;
      if (datacenter.systems != null) {
        dto.systems = datacenter.systems.map(
          system => PerformanceMetricTransformer.createSystemDetail(system),
        );
      } else {
        datacenter.systems = [];
      }
      response.datacenters.push(dto);
    });
    return response;
  }

  private static createSystemMetric(metric: SystemMetricEntity) {
    const metricDetail = new SystemMetric();
    metricDetail.date = metric.date;
    metricDetail.peak = metric.peak;
    metricDetail.type = metric.metricTypeEntity.name.replace(/(_WEEK)|(_MONTH)$/, '') as SystemMetricType;
    metricDetail.unit = metric.metricTypeEntity.unit;
    metricDetail.value = metric.value;
    return metricDetail;
  }

  private static createSystemDetail(system: SystemEntity): SystemDetail {
    const systemDetails: SystemDetail = new SystemDetail();
    systemDetails.id = system.idSystem;
    systemDetails.name = system.name;
    if (system.metrics != null) {
      systemDetails.metrics = system.metrics.map(
        metric => PerformanceMetricTransformer.createSystemMetric(metric),
      );
    } else {
      system.metrics = [];
    }
    return systemDetails;
  }
}
