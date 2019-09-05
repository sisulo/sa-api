import { MetricController } from './metric.controller';
import { HostGroupCollectorFactoryImpl } from '../factory/collectors/host-group-collector-factory.impl';
import { MetricRequestDto } from '../dto/metric-request.dto';
import { CollectorUtils } from '../../tests/collector.utils';
import { HostGroupMetricResponseTransformer } from '../transformers/host-group-metric-response.transformer';
import { HostGroupMetricService } from '../services/host-group-metric.service';
import { CollectorType } from '../factory/collector-type.enum';
import { ApiCollectorFactoryImpl } from '../factory/collectors/api-collector-factory.impl';

describe('MetricController', () => {
  let metricController: MetricController;
  let collector: any;
  let apiCollector: ApiCollectorFactoryImpl;
  let transformer: HostGroupMetricResponseTransformer;

  beforeEach(() => {
    transformer = new HostGroupMetricResponseTransformer();

    const service = new HostGroupMetricService(null, null, null, null);
    collector = new HostGroupCollectorFactoryImpl(transformer, service);
    apiCollector = new ApiCollectorFactoryImpl(collector, null, null, null);
    jest.spyOn(service, 'createOrUpdateMetric').mockReturnValue(Promise.resolve(CollectorUtils.createHostGroupEntity()));
    metricController = new MetricController(apiCollector);
  });

  describe('hostGroupMetrics', () => {
    it('should return an array of host group metrics', async () => {
      const result = CollectorUtils.createHostGroupMetricResponseDto();
      const dto = new MetricRequestDto();
      expect(
        await metricController.insertCompositeComponentMetric(
          'host_group_1',
          CollectorType.HOST_GROUPS,
          'system_name_1',
          dto),
      ).toStrictEqual(result);
    });
  });
});
