import { MetricType } from '../enums/metric-type.enum';
import { CatMetricTypeEntity } from '../entities/cat-metric-type.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { MetricTypeService } from './metric-type.service';
import { MetricGroup } from './data-center.service';

@Injectable()
export class CommonMetricService {

  private metricType: MetricTypeService;

  constructor(metricTypeService: MetricTypeService) {
    this.metricType = metricTypeService;
  }

  static validateMetricType(metricType: CatMetricTypeEntity, originMetricType: MetricType, expectedMetricGroup: MetricGroup): void {
    if (metricType == null) {
      throw new BadRequestException(`Wrong metric \'${originMetricType}\'`);
    }

    if (metricType.idCatMetricGroup !== expectedMetricGroup) {
      throw new BadRequestException(`Metric \'${originMetricType}\' is not ${MetricGroup[expectedMetricGroup]} metric`);
    }
  }

  protected loadMetricType(metricType: MetricType): Promise<CatMetricTypeEntity> {
    return this.metricType.findById(parseInt(MetricType[metricType], 10) || null);
  }
}
