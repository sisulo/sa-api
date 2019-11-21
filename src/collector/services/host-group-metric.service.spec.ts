import { CollectorUtils } from '../../tests/collector.utils';
import { HostGroupMetricService } from './host-group-metric.service';
import { HostGroupMetricEntity } from '../entities/host-group-metric.entity';
import { Repository } from 'typeorm';
import { MetricTypeService } from './metric-type.service';
import { CatMetricTypeEntity } from '../entities/cat-metric-type.entity';
import { EntityServiceError } from './entity-service.error';
import { SystemEntity } from '../entities/system.entity';
import { HostGroupService } from './host-group.service';
import { HostGroupEntity } from '../entities/host-group.entity';
import { SystemService } from './system.service';
import { ComponentKey } from '../controllers/metric.controller';

function createCatMetricTypeEntity(): CatMetricTypeEntity {
  const metricType = new CatMetricTypeEntity();
  metricType.unit = 'TB';
  metricType.idCatMetricType = 29;
  metricType.name = 'NET_TOTAL';
  return metricType;
}

function createHostGroupMetricEntity(id?: number | 999): HostGroupMetricEntity {
  const entity = new HostGroupMetricEntity();
  entity.value = 123;
  entity.date = new Date('2019-09-01');
  if (id === undefined) {
    entity.id = 999;
  } else {
    entity.id = id;
  }
  entity.hostGroup = createHostGroupEntity();
  entity.metricTypeEntity = createCatMetricTypeEntity();

  return entity;
}

function createSystemEntity(): SystemEntity {
  const systemEntity = new SystemEntity();
  systemEntity.idSystem = 2;
  systemEntity.name = 'System_1';
  return systemEntity;
}

function createHostGroupEntity(id?: number | 999): HostGroupEntity {
  const entity = new HostGroupEntity();
  if (id === undefined) {
    entity.idHostGroup = 999;
  } else {
    entity.idHostGroup = id;
  }
  entity.name = 'Host_Group_1';

  entity.system = createSystemEntity();

  return entity;
}

describe('HostGroupMetricService', () => {
  let service: HostGroupMetricService;
  const metricTypeService: MetricTypeService = new MetricTypeService(new Repository<CatMetricTypeEntity>());
  const repository = new Repository<HostGroupMetricEntity>();
  const hostGroupRepository = new Repository<HostGroupEntity>();
  const hostGroupService: HostGroupService = new HostGroupService(hostGroupRepository);
  const systemService: SystemService = new SystemService(new Repository<SystemEntity>());

  beforeEach(() => {
    repository.save = jest.fn().mockImplementation(entity => {
      if (entity.id === undefined) {
        entity.id = 999;
      }
      return entity;
    });
    hostGroupRepository.save = jest.fn().mockImplementation(entity => {
      if (entity.id === undefined) {
        entity.idHostGroup = 999;
      }
      return entity;
    });
    service = new HostGroupMetricService(repository, metricTypeService, hostGroupService, systemService);
    jest.spyOn(metricTypeService, 'findById').mockReturnValue(Promise.resolve(createCatMetricTypeEntity()));
    jest.spyOn(hostGroupService, 'findByName').mockReturnValue(Promise.resolve(createHostGroupEntity()));
    jest.spyOn(repository, 'findOne').mockReturnValue(Promise.resolve(null));
  });

  it('should return host-group entity', async () => {
    const request = CollectorUtils.createHostGroupMetricRequestDto();
    expect(await service.createOrUpdateMetric({
      childName: 'Host_Group_1',
      parentName: 'Systen_1',
    } as ComponentKey, request)).toStrictEqual(createHostGroupMetricEntity());
  });
  it('should throw error because metric type not found', async () => {
    jest.spyOn(metricTypeService, 'findById').mockReturnValue(null);
    const request = CollectorUtils.createHostGroupMetricRequestDto();
    await expect(service.createOrUpdateMetric({
      childName: 'Host_Group_1',
      parentName: 'Systen_1',
    } as ComponentKey, request))
      .rejects
      .toThrowError(EntityServiceError);
  });
  it('should load existing metric and update values by request', async () => {
    const request = CollectorUtils.createHostGroupMetricRequestDto();
    const expectedEntity = createHostGroupMetricEntity();
    expectedEntity.id = 12;
    jest.spyOn(repository, 'findOne').mockReturnValue(Promise.resolve(createHostGroupMetricEntity(12)));
    expect(await service.createOrUpdateMetric({
      childName: 'Host_Group_1',
      parentName: 'Systen_1',
    } as ComponentKey, request)).toStrictEqual(expectedEntity);
  });

  it('should save metric with new hostgroup', async () => {
    jest.spyOn(hostGroupService, 'findByName').mockReturnValue(null);
    jest.spyOn(systemService, 'findByName').mockReturnValue(Promise.resolve(createSystemEntity()));
    const request = CollectorUtils.createHostGroupMetricRequestDto();

    const expectedEntity = createHostGroupMetricEntity();
    expect(await service.createOrUpdateMetric({
      childName: 'Host_Group_1',
      parentName: 'Systen_1',
    } as ComponentKey, request)).toStrictEqual(expectedEntity);
  });
});
