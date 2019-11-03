import { Injectable } from '@nestjs/common';
import { SystemMetricService } from '../../collector/services/system-metric.service';
import { GraphDataParams } from '../controllers/params/graph-data.params';

@Injectable()
export class GraphDataService {
  constructor(private readonly metricService: SystemMetricService) {
  }

  async getGraphData(graphFilter: GraphDataParams): Promise<any[]> {
    return await Promise.all(graphFilter.types.map(async metricType => {
      const result = await this.metricService.getMetricGraph(metricType);
      return {type: metricType, data: result};
    }));
  }
}
