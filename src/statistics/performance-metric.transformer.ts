import { SystemDetail } from './models/SystemDetail';
import { SystemMetric } from './models/metrics/SystemMetric';
import { PerformanceStatisticsDto } from './models/dtos/PerformanceStatisticsDto';
import { DataCenterEntity } from '../collector/entities/data-center.entity';
import { SystemMetricEntity } from '../collector/entities/system-metric.entity';
import { SystemEntity } from '../collector/entities/system.entity';

export class PerformanceMetricTransformer {
  public static async transform(dataCenter: DataCenterEntity): Promise<PerformanceStatisticsDto> {
    const response = new PerformanceStatisticsDto();
    response.id = dataCenter.idDatacenter;
    response.label = dataCenter.name;
    if (dataCenter.systems != null) {
      response.systems = dataCenter.systems.map(
        system => PerformanceMetricTransformer.createSystemDetail(system),
      );
    } else {
      dataCenter.systems = [];
    }
    return response;
  }

  private static createSystemMetric(metric: SystemMetricEntity) {
    const metricDetail = new SystemMetric();
    metricDetail.date = metric.date;
    metricDetail.peak = metric.peak;
    metricDetail.type = metric.metricTypeEntity.name;
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
