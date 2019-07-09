import { Test, TestingModule } from '@nestjs/testing';
import { CapacityMetricService } from './capacity-metric.service';

describe('CapacityMetricService', () => {
  let service: CapacityMetricService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CapacityMetricService],
    }).compile();

    service = module.get<CapacityMetricService>(CapacityMetricService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
