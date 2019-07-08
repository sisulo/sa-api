import { SystemDetail } from './dto/models/SystemDetail';
import { SystemMetric } from './dto/models/metrics/SystemMetric';
import { PerformanceStatisticsDto } from './dto/models/dtos/PerformanceStatisticsDto';
import { DataCenterEntity } from '../collector/entities/data-center.entity';
import { SystemMetricEntity } from '../collector/entities/system-metric.entity';
import { SystemEntity } from '../collector/entities/system.entity';

export class PerformanceMetricTransformer {
  public static async transform(dataCenterPromise: Promise<DataCenterEntity>): Promise<PerformanceStatisticsDto> {
    const response = new PerformanceStatisticsDto();
    const dataCenter = await dataCenterPromise.then(entity => entity);
    response.id = dataCenter.idDatacenter;
    response.label = dataCenter.name;
    response.systems = dataCenter.systems.map(
      system => PerformanceMetricTransformer.createSystemDetail(system),
    );
    return response;
  }

  private static createSystemMetric(metric: SystemMetricEntity) {
    const metricDetail = new SystemMetric();
    metricDetail.date = metric.date;
    metricDetail.peak = metric.peak;
    metricDetail.type = metric.metricTypeEntity.name;
    metricDetail.unit = metric.metricTypeEntity.unit;
    metricDetail.value = parseFloat(metric.value);
    return metricDetail;
  }

  private static createSystemDetail(system: SystemEntity): SystemDetail {
    const systemDetails: SystemDetail = new SystemDetail();
    systemDetails.id = system.idSystem;
    systemDetails.name = system.name;
    systemDetails.metrics = system.metrics.map(
      metric => PerformanceMetricTransformer.createSystemMetric(metric),
    );
    return systemDetails;
  }
}
