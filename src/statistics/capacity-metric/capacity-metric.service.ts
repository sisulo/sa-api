import { Injectable } from '@nestjs/common';
import { DataCenterService } from '../../collector/data-center.service';
import { CapacityMetricTransformer } from '../capacity-metric.transformer';

@Injectable()
export class CapacityMetricService {

  constructor(private dataCenterService: DataCenterService) {
  }

  getMetricByIdDatacenter(idDataCenter: number, date: Date) {
    const entities = this.dataCenterService.getCapacityMetrics(idDataCenter, date);
    console.log(entities);
    return CapacityMetricTransformer.transform(entities);
  }
}
