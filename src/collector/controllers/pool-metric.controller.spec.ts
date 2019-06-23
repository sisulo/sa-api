import { Test, TestingModule } from '@nestjs/testing';
import { PoolMetricController } from './pool-metric.controller';

describe('PoolMetric Controller', () => {
  let controller: PoolMetricController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoolMetricController],
    }).compile();

    controller = module.get<PoolMetricController>(PoolMetricController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
