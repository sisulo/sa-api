import { MetricType } from '../enums/metric-type.enum';
import { CatMetricTypeEntity } from '../entities/cat-metric-type.entity';
import { BadRequestException } from '@nestjs/common';
import { MetricTypeService } from './metric-type.service';
import { MetricGroup } from './data-center.service';
import { SystemEntity } from '../entities/system.entity';
import { MetricRequestDto } from '../dto/metric-request.dto';
import { EntityServiceError } from './entity-service.error';
import { CreateComponentInterface } from './createComponentInterface';

export abstract class CommonMetricService<MetricServiceType, ComponentType> {

  protected parentComponentService: CreateComponentInterface<SystemEntity>;
  protected childComponentService: CreateComponentInterface<ComponentType>;
  private metricType: MetricTypeService;

  protected constructor(metricTypeService: MetricTypeService,
                        parentComponentService: CreateComponentInterface<SystemEntity>,
                        childComponentService: CreateComponentInterface<ComponentType>) {
    this.metricType = metricTypeService;
    this.parentComponentService = parentComponentService;
    this.childComponentService = childComponentService;
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

  // TODO HostGroupMetricEntity shouldn't be in returned type
  async createOrUpdateMetric(childComponentName: string, parentComponentName: string, request: MetricRequestDto): Promise<MetricServiceType> {

    const metricType = await this.loadMetricType(request.metricType);

    if (metricType == null) {
      throw new EntityServiceError(`Metric(${request.metricType}) from request is unknown`);
    }

    const component = await this.loadComponent(parentComponentName, childComponentName);

    if (component == null) {
      throw new EntityServiceError(`Cannot load Host Group entity by name ${childComponentName}.`);
    }

    const returnedEntity = await this.save(component, metricType, request);

    return returnedEntity;
  }

  async abstract save(component: ComponentType, metricType: CatMetricTypeEntity, request: MetricRequestDto);

  protected loadMetricType(metricType: MetricType): Promise<CatMetricTypeEntity> {
    return this.metricType.findById(parseInt(MetricType[metricType], 10) || null);
  }

  protected async loadComponent(parentComponentName: string, childComponentName: string): Promise<ComponentType> {
    const childComponent = await this.childComponentService.findByName(childComponentName, parentComponentName);
    if (childComponent == null) {
      const parentComponent = await this.loadParentComponent(parentComponentName);
      return await this.childComponentService.create(childComponentName, parentComponent);
    }
    return childComponent;
  }

  protected async loadParentComponent(parentComponentName: string): Promise<SystemEntity> {
    const parentComponent = await this.parentComponentService.findByName(parentComponentName, null);
    if (parentComponent == null) {
      return await this.parentComponentService.create(parentComponentName);
    }
    return parentComponent;
  }
}
