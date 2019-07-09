import { Injectable } from '@nestjs/common';
import { DataCenterService } from '../../collector/data-center.service';
import { AdapterMetricTransformer } from '../adapter-metric.transformer';

@Injectable()
export class ChannelAdapterMetricService {
  constructor(private dataCenterService: DataCenterService) {
  }

  getMetricByIdDatacenter(idDataCenter: number, date: Date) {
    const entities = this.dataCenterService.getChannelAdapterMetrics(idDataCenter, date);
    return AdapterMetricTransformer.transform(entities);
  }
}
