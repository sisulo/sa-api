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

  static validateMetricType(metricType: CatMetricTypeEntity, originMetricType: MetricType, expectedMetricGroups: MetricGroup[]): void {
    if (metricType == null) {
      throw new BadRequestException(`Wrong metric \'${originMetricType}\'`);
    }

    if (expectedMetricGroups.find(group => group === metricType.idCatMetricGroup) === undefined) {
      const groupsString = this.convertMetricGroupToStrings(expectedMetricGroups);
      throw new BadRequestException(`Metric \'${originMetricType}\' is not ${groupsString} metric`);
    }
  }

  private static convertMetricGroupToStrings(groups: MetricGroup[]) {
    return groups.map(group => MetricGroup[group])
      .join(',');
  }

  protected loadMetricType(metricType: MetricType): Promise<CatMetricTypeEntity> {
    return this.metricType.findById(parseInt(MetricType[metricType], 10) || null);
  }
}
