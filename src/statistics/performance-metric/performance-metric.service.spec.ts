import { Test, TestingModule } from '@nestjs/testing';
import { PerformanceMetricService } from './performance-metric.service';

describe('PerformanceMetricService', () => {
  let service: PerformanceMetricService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerformanceMetricService],
    }).compile();

    service = module.get<PerformanceMetricService>(PerformanceMetricService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
