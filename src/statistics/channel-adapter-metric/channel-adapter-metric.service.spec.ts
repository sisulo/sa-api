import { Test, TestingModule } from '@nestjs/testing';
import { ChannelAdapterMetricService } from './channel-adapter-metric.service';

describe('ChannelAdapterMetricService', () => {
  let service: ChannelAdapterMetricService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelAdapterMetricService],
    }).compile();

    service = module.get<ChannelAdapterMetricService>(ChannelAdapterMetricService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
