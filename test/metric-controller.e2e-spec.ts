import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('Collector', () => {
  let app;
  const SYSTEM_NAME = 'XP7_G11_58417';
  const DATE = '2019-07-15';
  const METRIC_VALUE = '12345';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Create host group metric (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/systems/XP7_G11_58417/host-groups/czchoct007/metrics')
      .send({
        metricType: 'NET_TOTAL',
        value: METRIC_VALUE,
        date: '2019-07-13',
      })
      .expect(201)
      .expect(
        {
          // Todo delete ID generated from comparision
          idMetric: 1,
          date: '2019-07-13',
          value: METRIC_VALUE,
          metricType: 'NET_TOTAL',
          owner: {
            id: 1,
            name: 'czchoct007',
            status: 'ACTIVE',
            type: 'HOST_GROUP',
            parent: {
              id: 1,
              name: SYSTEM_NAME,
              status: 'ACTIVE',
              type: 'SYSTEM',
            },
          },
        },
      );
  });
  it('Update host group metric (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/systems/XP7_G11_58417/host-groups/czchoct007/metrics')
      .send({
        metricType: 'NET_TOTAL',
        value: METRIC_VALUE,
        date: DATE,
      })
      .expect(201)
      .expect(
        {
          // Todo delete ID generated from comparision
          idMetric: 2,
          date: DATE,
          value: METRIC_VALUE,
          metricType: 'NET_TOTAL',
          owner: {
            id: 1,
            name: 'czchoct007',
            status: 'ACTIVE',
            type: 'HOST_GROUP',
            parent: {
              id: 1,
              name: SYSTEM_NAME,
              status: 'ACTIVE',
              type: 'SYSTEM',
            },
          },
        },
      ).then(() => {
        return request(app.getHttpServer())
          .post('/api/v1/systems/XP7_G11_58417/host-groups/czchoct007/metrics')
          .send({
            metricType: 'NET_TOTAL',
            value: '5555',
            date: DATE,
          }).expect(201)
          .expect({
              // Todo delete ID generated from comparision
              idMetric: 2,
              date: DATE,
              value: '5555',
              metricType: 'NET_TOTAL',
              owner: {
                id: 1,
                name: 'czchoct007',
                type: 'HOST_GROUP',
                status: 'ACTIVE',
                parent: {
                  id: 1,
                  name: SYSTEM_NAME,
                  type: 'SYSTEM',
                  status: 'ACTIVE',
                },
              },
            },
          );
      });

  });
  it('Create pool metric (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/systems/XP7_G11_58417/pools/Pool123/metrics')
      .send({
        metricType: 'PHYSICAL_CAPACITY',
        value: METRIC_VALUE,
        date: DATE,
      })
      .expect(201)
      .expect(
        {
          // Todo delete ID generated from comparision
          idMetric: 1,
          date: DATE,
          value: METRIC_VALUE,
          metricType: 'PHYSICAL_CAPACITY',
          owner: {
            id: 79,
            name: 'Pool123',
            type: 'POOL',
            status: 'ACTIVE',
            parent: {
              id: 1,
              name: SYSTEM_NAME,
              type: 'SYSTEM',
              status: 'ACTIVE',
            },
          },
        },
      );
  });
  it('Create cha metric (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/systems/XP7_G11_58417/chas/Cha123/metrics')
      .send({
        metricType: 'IMBALANCE_ABSOLUT',
        value: METRIC_VALUE,
        date: DATE,
      })
      .expect(201)
      .expect(
        {
          // Todo delete ID generated from comparision
          idMetric: 1,
          date: DATE,
          value: METRIC_VALUE,
          metricType: 'IMBALANCE_ABSOLUT',
          owner: {
            id: 115,
            name: 'Cha123',
            type: 'ADAPTER',
            status: 'ACTIVE',
            parent: {
              id: 1,
              name: SYSTEM_NAME,
              type: 'SYSTEM',
              status: 'ACTIVE',
            },
          },
        },
      );
  });
  it('Create system metric (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/systems/XP7_G11_58417/metrics')
      .send({
        metricType: 'WORKLOAD',
        value: METRIC_VALUE,
        peak: '5',
        date: DATE,
      })
      .expect(201)
      .expect(
        {
          // Todo delete ID generated from comparision
          idMetric: 1,
          date: DATE,
          value: METRIC_VALUE,
          peak: '5',
          metricType: 'WORKLOAD',
          owner: {
            id: 1,
            name: SYSTEM_NAME,
            type: 'SYSTEM',
            status: 'ACTIVE',
          },
        },
      );
  });
  it('Create port metric (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/systems/XP7_G11_58417/chas/CHA-1PC%2CCHA-33PC/ports/1D%2C2D/metrics')
      .send({
        metricType: 'IMBALANCE_EVENTS',
        value: METRIC_VALUE,
        date: DATE,
      })
      .expect(201)
      .expect(
        {
          // Todo delete ID generated from comparision
          idMetric: 1,
          date: DATE,
          value: METRIC_VALUE,
          metricType: 'IMBALANCE_EVENTS',
          owner: {
            id: 1,
            name: '1D,2D',
            type: 'PORT',
            status: 'ACTIVE',
            parent: {
              id: 116,
              name: 'CHA-1PC,CHA-33PC',
              type: 'ADAPTER',
              status: 'ACTIVE',
              parent: {
                id: 1,
                name: SYSTEM_NAME,
                type: 'SYSTEM',
                status: 'ACTIVE',
              },
            },
          },
        },
      );
  });

  it('Update system status (POST)', () => {
    return request(app.getHttpServer())
      .put('/api/v1/systems/XP7_G11_58417/status')
      .send({
        status: 'INACTIVE',
      })
      .expect(200)
      .expect(
        {
          // Todo delete ID generated from comparision
          storageEntity: {
            id: 1,
            name: 'XP7_G11_58417',
            status: 'INACTIVE',
            type: 'SYSTEM',
          },
          externals: [],
        },
      );
  });

  it('Update pool status (POST)', () => {
    return request(app.getHttpServer())
      .put('/api/v1/systems/XP7_G11_58417/pools/Pool123/status')
      .send({
        status: 'INACTIVE',
      })
      .expect(200)
      .expect(
        {
          // Todo delete ID generated from comparision
          storageEntity: {
            id: 79,
            name: 'Pool123',
            status: 'INACTIVE',
            type: 'POOL',
            parent: {
              id: 1,
              name: 'XP7_G11_58417',
              type: 'SYSTEM',
              status: 'INACTIVE',
            },
          },
          externals: [],
        },
      );
  });
  it('Update host group status (POST)', () => {
    return request(app.getHttpServer())
      .put('/api/v1/systems/XP7_G11_58417/host-groups/czchoct007/status')
      .send({
        status: 'INACTIVE',
      })
      .expect(200)
      .expect(
        {
          // Todo delete ID generated from comparision
          storageEntity: {
            id: 1,
            name: 'czchoct007',
            status: 'INACTIVE',
            type: 'HOST_GROUP',
            parent: {
              id: 1,
              name: 'XP7_G11_58417',
              type: 'SYSTEM',
              status: 'INACTIVE',
            },
          },
          externals: [],
        },
      );
  });
  it('Update adapter status (POST)', () => {
    return request(app.getHttpServer())
      .put('/api/v1/systems/XP7_G11_58417/chas/Cha123/status')
      .send({
        status: 'INACTIVE',
      })
      .expect(200)
      .expect(
        {
          // Todo delete ID generated from comparision
          storageEntity: {
            id: 115,
            name: 'Cha123',
            status: 'INACTIVE',
            type: 'ADAPTER',
            parent: {
              id: 1,
              name: 'XP7_G11_58417',
              type: 'SYSTEM',
              status: 'INACTIVE',
            },
          },
          externals: [],
        },
      );
  });
  it('Update adapter status when not exists(PUT)', () => {
    return request(app.getHttpServer())
      .put('/api/v1/systems/XP7_G11_58417/chas/ChaXXX/status')
      .send({
        status: 'INACTIVE',
      })
      .expect(404);
  });
  it('Update port status (POST)', () => {
    return request(app.getHttpServer())
      .put('/api/v1/systems/XP7_G11_58417/chas/CHA-1PC%2CCHA-33PC/ports/1D%2C2D/status')
      .send({
        status: 'INACTIVE',
      })
      .expect(200)
      .expect(
        {
          // Todo delete ID generated from comparision
          storageEntity: {
            id: 1,
            name: '1D,2D',
            type: 'PORT',
            status: 'INACTIVE',
            parent: {
              id: 116,
              name: 'CHA-1PC,CHA-33PC',
              status: 'ACTIVE',
              type: 'ADAPTER',
              parent: {
                id: 1,
                name: 'XP7_G11_58417',
                type: 'SYSTEM',
                status: 'INACTIVE',
              },
            },
          },
          externals: [],
        },
      );
  });
  afterAll(async () => {
    await app.close();
  });
});
