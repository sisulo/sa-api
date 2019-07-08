import { Injectable } from '@nestjs/common';
import { PerformanceMetricTransformer } from '../performance-metric.transformer';
import { DataCenterService } from '../../collector/data-center.service';

@Injectable()
export class PerformanceMetricService {
  constructor(private systemService: DataCenterService) {}

  getMetricByIdDatacenter(idDatacenter: number, date: Date) {
    const entities = this.systemService.getPerformanceMetrics(idDatacenter, date);
    return PerformanceMetricTransformer.transform(entities);
  }

}
