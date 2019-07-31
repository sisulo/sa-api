import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('API V1 System metric (e2e)', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/v1/systems/5/metrics (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/systems/5/metrics')
      .send({
        metricType: 'WORKLOAD',
        value: '12345',
        peak: '123215',
        date: '2019-07-12',
      })
      .expect(201)
      .expect(
        {
          idMetric: 1,
          date: '2019-07-12',
          value: '12345',
          idSystem: 5,
          systemName: 'XP7_G15_20028',
          metricType: 'WORKLOAD',
        },
      );
  });

  it('/api/v1/systems/5/metrics (POST) Update existing', () => {
    return request(app.getHttpServer())
      .post('/api/v1/systems/5/metrics')
      .send({
        metricType: 'WORKLOAD',
        value: '12346',
        peak: '123215',
        date: '2019-07-12',
      })
      .expect(201)
      .expect(
        {
          idMetric: 1,
          date: '2019-07-12',
          value: '12346',
          idSystem: 5,
          systemName: 'XP7_G15_20028',
          metricType: 'WORKLOAD',
        },
      );
  });
  afterAll(async () => {
    await app.close();
  });
});
