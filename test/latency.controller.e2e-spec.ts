import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { OperationType } from '../src/collector/enums/operation-type.enum';
import { LatencyMetadata, OperationData } from '../src/statistics/services/latency-block-size.service';

describe('Latency Controller', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Getting data from database', () => {
    return request(app.getHttpServer())
      .post('/api/v1/systems/XP7_G12_58416/pools/Pool%236%20AFA-T1/latencyPerBlockSize')
      .send({
        metricType: 'LATENCY_PER_BLOCK_SIZE',
        date: '2019-09-12',
        operation: 'READ',
        data: [
          {
            latency: 0.25,
            blockSize: 2,
            count: 500,

          },
          {
            latency: 4,
            blockSize: 16,
            count: 20,
          },
        ],
      }).expect(201).then(() =>
        request(app.getHttpServer())
          .post('/api/v1/latency/data')
          .send({
            poolIds: [9, 2],
            operations: ['READ'],
            dates: ['2019-09-12'],
          })
          .expect(200)
          .expect([
              {
                operation: OperationType.READ,
                values: [
                  { x: 2, y: 0.25, z: 500 },
                  { x: 16, y: 4, z: 20 },
                ],
              } as OperationData,
            ],
          ),
      );
  });

  it('Getting metadata', () => {
    const date = '2019-09-12';
    return request(app.getHttpServer())
      .post('/api/v1/systems/XP7_G12_58416/pools/Pool%236%20AFA-T1/latencyPerBlockSize')
      .send({
        metricType: 'LATENCY_PER_BLOCK_SIZE',
        date: '2019-09-12',
        operation: 'READ',
        data: [
          {
            latency: 0.25,
            blockSize: 2,
            count: 500,

          },
          {
            latency: 4,
            blockSize: 16,
            count: 20,
          },
        ],
      }).expect(201).then(() =>
        request(app.getHttpServer())
          .get('/api/v1/latency/metadata')
          .expect(200)
          .expect(
            {
              dates: [date],
              systems: [{
                id: 2,
                name: 'XP7_G12_58416',
                pools: [{
                  id: 9,
                  name: 'Pool#6 AFA-T1',
                  metrics: [],
                }],
              }],
            } as LatencyMetadata,
          ),
      );
  });
});
