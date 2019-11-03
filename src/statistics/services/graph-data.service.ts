import { Injectable } from '@nestjs/common';
import { SystemMetricService } from '../../collector/services/system-metric.service';

@Injectable()
export class GraphDataService {
  constructor(private metricService: SystemMetricService) {
  }

  public getGraphData() {
    return this.metricService.getGraphData();
  }
}
