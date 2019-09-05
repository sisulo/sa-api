import { HostGroupMetricEntity } from '../collector/entities/host-group-metric.entity';
import { CatMetricTypeEntity } from '../collector/entities/cat-metric-type.entity';
import { HostGroupEntity } from '../collector/entities/host-group.entity';
import { HostGroupMetricResponseDto } from '../collector/dto/host-group-metric-response.dto';
import { SystemEntity } from '../collector/entities/system.entity';
import { MetricType } from '../collector/enums/metric-type.enum';
import { MetricRequestDto } from '../collector/dto/metric-request.dto';
import { ChaMetricEntity } from '../collector/entities/cha-metric.entity';
import { ChaEntity } from '../collector/entities/cha.entity';
import { ChaMetricResponseDto } from '../collector/dto/cha-metric-response.dto';
import { PoolMetricEntity } from '../collector/entities/pool-metric.entity';
import { PoolEntity } from '../collector/entities/pool.entity';
import { PoolMetricResponseDto } from '../collector/dto/pool-metric-response.dto';
import { SystemMetricEntity } from '../collector/entities/system-metric.entity';
import { SystemMetricResponseDto } from '../collector/dto/system-metric-response.dto';

export class CollectorUtils {

  static createHostGroupMetricResponseDto(): HostGroupMetricResponseDto {
    const dto = new HostGroupMetricResponseDto();
    dto.hostGroupName = 'host_group_1';
    dto.idHostGroup = 2;
    dto.date = new Date('2019-08-29');
    dto.idMetric = 1;
    dto.metricType = 'NET_TOTAL';
    dto.value = 158.6;
    dto.idSystem = 2;
    dto.systemName = 'System_2';

    return dto;

  }

  static createHostGroupEntity(): HostGroupMetricEntity {
    const type = new CatMetricTypeEntity();
    type.name = 'NET_TOTAL';
    type.idCatMetricType = 29;
    type.unit = 'TB';

    const hostGroup = new HostGroupEntity();
    hostGroup.name = 'host_group_1';
    hostGroup.idHostGroup = 2;
    hostGroup.system = CollectorUtils.createSystemEntity();

    const metric = new HostGroupMetricEntity();
    metric.id = 1;
    metric.metricTypeEntity = type;
    metric.date = new Date('2019-08-29');
    metric.value = 158.6;
    metric.hostGroup = hostGroup;

    return metric;
  }

  static createHostGroupMetricRequestDto(): MetricRequestDto {
    const request = {
      metricType: MetricType.NET_TOTAL,
      value: 123,
      date: new Date('2019-09-01'),
    } as (MetricRequestDto);
    return request;
  }

  static createChaMetricEntity(): ChaMetricEntity {
    const entity = new ChaMetricEntity();
    entity.adapter = CollectorUtils.createAdapter();
    entity.id = 2;
    const metricTypeEntity = new CatMetricTypeEntity();
    metricTypeEntity.name = 'SLA_EVENTS';
    metricTypeEntity.idCatMetricType = 13;
    metricTypeEntity.unit = '';
    entity.metricTypeEntity = metricTypeEntity;
    entity.value = 5;
    entity.date = new Date('2019-09-01');
    return entity;
  }

  static createAdapter(): ChaEntity {
    const entity = new ChaEntity();
    entity.idCha = 1;
    entity.name = 'Cha_1';
    entity.system = CollectorUtils.createSystemEntity();

    return entity;
  }

  static createChaMetricResponseDto(): ChaMetricResponseDto {
    const dto = new ChaMetricResponseDto();
    dto.chaName = 'Cha_1';
    dto.idCha = 1;
    dto.systemName = 'System_2';
    dto.idSystem = 2;
    dto.idMetric = 2;
    dto.value = 5;
    dto.metricType = 'SLA_EVENTS';
    dto.date = new Date('2019-09-01');
    return dto;
  }

  static createPoolEntity(): PoolEntity {
    const entity = new PoolEntity();
    entity.name = 'Pool_1';
    entity.idPool = 1;

    entity.system = CollectorUtils.createSystemEntity();
    return entity;
  }

  static createPoolMetricEntity(): PoolMetricEntity {
    const entity = new PoolMetricEntity();
    entity.id = 2;
    entity.date = new Date('2019-09-01');
    entity.value = 5;

    const metricType = new CatMetricTypeEntity();
    metricType.unit = '%';
    metricType.idCatMetricType = 2;
    metricType.name = 'PHYSICAL_SUBS_PERC';

    entity.metricTypeEntity = metricType;

    entity.pool = CollectorUtils.createPoolEntity();

    return entity;
  }

  static createPoolMetricResponseDto(): PoolMetricResponseDto {
    const dto = new PoolMetricResponseDto();
    dto.idPool = 1;
    dto.poolName = 'Pool_1';
    dto.idMetric = 2;
    dto.idSystem = 2;
    dto.systemName = 'System_2';
    dto.date = new Date('2019-09-01');
    dto.metricType = 'PHYSICAL_SUBS_PERC';
    dto.value = 5;
    return dto;
  }

  static createSystemEntity(): SystemEntity {
    const system = new SystemEntity();
    system.name = 'System_2';
    system.idSystem = 2;

    return system;
  }

  static createSystemMetricEntity(): SystemMetricEntity {
    const entity = new SystemMetricEntity();
    entity.id = 1;
    entity.peak = 10;
    entity.value = 5;
    entity.date = new Date('2019-09-01');
    entity.system = CollectorUtils.createSystemEntity();

    const metricType = new CatMetricTypeEntity();
    metricType.unit = 'Mbps';
    metricType.idCatMetricType = 7;
    metricType.name = 'WORKLOAD';

    entity.metricTypeEntity = metricType;
    return entity;
  }

  static createSystemMetricResponseDto(): SystemMetricResponseDto {
    const dto = new SystemMetricResponseDto();
    dto.idMetric = 1;
    dto.peak = 10;
    dto.value = 5;
    dto.systemName = 'System_2';
    dto.idSystem = 2;
    dto.date = new Date('2019-09-01');
    dto.metricType = 'WORKLOAD';
    return dto;
  }
}
