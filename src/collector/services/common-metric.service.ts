import { MetricType } from '../enums/metric-type.enum';
import { CatMetricTypeEntity } from '../entities/cat-metric-type.entity';
import { BadRequestException } from '@nestjs/common';
import { MetricTypeService } from './metric-type.service';
import { MetricGroup } from './data-center.service';
import { MetricRequestDto } from '../dto/metric-request.dto';
import { EntityServiceError } from './entity-service.error';
import { CreateComponentInterface } from './createComponentInterface';
import { ComponentKey } from '../controllers/metric.controller';
import { Repository } from 'typeorm';
import { StorageEntityInterface } from '../entities/storage-entity.interface';
import { AbstractMetricEntity } from '../entities/abstract-metric.entity';

export abstract class CommonMetricService<MetricServiceType extends AbstractMetricEntity, ChildComponentType extends StorageEntityInterface, ParentComponentType, GrandParentComponentType> {

  protected childComponentService: CreateComponentInterface<ChildComponentType, ParentComponentType>;
  protected parentComponentService: CreateComponentInterface<ParentComponentType, GrandParentComponentType>;
  protected grandParentComponentService: CreateComponentInterface<GrandParentComponentType, null>;
  private metricType: MetricTypeService;

  protected constructor(metricTypeService: MetricTypeService,
                        childComponentService: CreateComponentInterface<ChildComponentType, ParentComponentType>,
                        parentComponentService: CreateComponentInterface<ParentComponentType, GrandParentComponentType>,
                        grandParentComponentService: CreateComponentInterface<GrandParentComponentType, null>,
                        private repository: Repository<MetricServiceType>,
                        private type: new () => MetricServiceType,
  ) {
    this.metricType = metricTypeService;
    this.parentComponentService = parentComponentService;
    this.childComponentService = childComponentService;
    this.grandParentComponentService = grandParentComponentService;
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

  protected createMetricEntity = async (component: ChildComponentType, metricType: CatMetricTypeEntity, dateSearch: Date): Promise<MetricServiceType> => {
    const metricDao = await this.repository.createQueryBuilder('metric')
      .where('metric.owner=:owner', { owner: component.id })
      .andWhere('metric.metricTypeEntity = :type', { type: metricType.idCatMetricType })
      .andWhere('metric.date = :date', { date: dateSearch })
      .getOne();
    if (metricDao == null) {
      return new this.type();
    }
    return metricDao;
  }

  private static convertMetricGroupToStrings(groups: MetricGroup[]) {
    return groups.map(group => MetricGroup[group])
      .join(',');
  }

  async createOrUpdateMetric(componentKey: ComponentKey, request: MetricRequestDto): Promise<MetricServiceType> {
    // TODO when the exception is thrown than HTTP 400 should be returned instead of 500
    const metricType = await this.loadMetricType(request.metricType);

    if (metricType == null) {
      throw new EntityServiceError(`Metric(${request.metricType}) from request is unknown`);
    }

    const component = await this.loadComponent(componentKey);

    if (component == null) {
      throw new EntityServiceError(`Cannot load Host Group entity by name ${componentKey.childName}.`);
    }

    return await this.save(component, metricType, request);
  }

  async abstract save(component: ChildComponentType, metricType: CatMetricTypeEntity, request: MetricRequestDto);

  protected loadMetricType(metricType: MetricType): Promise<CatMetricTypeEntity> {
    return this.metricType.findById(parseInt(MetricType[metricType], 10) || null);
  }

  protected async loadComponent(componentKey: ComponentKey): Promise<ChildComponentType> {
    const childComponent = await this.childComponentService.findByName(componentKey.childName, componentKey.parentName, componentKey.grandParentName);
    if (childComponent == null) {
      const parentComponent = await this.loadParentComponent(componentKey);
      return await this.childComponentService.create(componentKey.childName, parentComponent);
    }
    return childComponent;
  }

  protected async loadParentComponent(componentKey: ComponentKey): Promise<ParentComponentType> {
    if (this.parentComponentService === null) {
      return null;
    }
    const parentComponent = await this.parentComponentService.findByName(componentKey.parentName, componentKey.grandParentName);
    if (parentComponent == null) {
      const grandParentComponent = await this.loadGrandParentComponent(componentKey);
      return await this.parentComponentService.create(componentKey.parentName, grandParentComponent);
    }
    return parentComponent;
  }

  protected async loadGrandParentComponent(componentKey: ComponentKey): Promise<GrandParentComponentType> {
    if (this.grandParentComponentService === null) {
      return null;
    }
    const childComponent = await this.grandParentComponentService.findByName(componentKey.grandParentName, null);
    if (childComponent == null) {
      return await this.grandParentComponentService.create(componentKey.grandParentName);
    }
    return childComponent;
  }
}
