import { Injectable } from '@nestjs/common';
import { PerformanceMetricTransformer } from '../performance-metric.transformer';
import { DataCenterService } from '../../collector/data-center.service';

@Injectable()
export class PerformanceMetricService {
  constructor(private dataCenterService: DataCenterService) {}

  getMetricByIdDatacenter(idDatacenter: number, date: Date) {
    const entities = this.dataCenterService.getPerformanceMetrics(idDatacenter, date);
    return PerformanceMetricTransformer.transform(entities);
  }

}
