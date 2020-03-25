import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('Collector', () => {
  let app;

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
        value: '12345',
        date: '2019-07-13',
      })
      .expect(201)
      .expect(
        {
          // Todo delete ID generated from comparision
          idMetric: 1,
          date: '2019-07-13',
          value: '12345',
          idSystem: 1,
          systemName: 'XP7_G11_58417',
          metricType: 'NET_TOTAL',
          idHostGroup: 1,
          hostGroupName: 'czchoct007',
        },
      );
  });
  it('Update host group metric (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/systems/XP7_G11_58417/host-groups/czchoct007/metrics')
      .send({
        metricType: 'NET_TOTAL',
        value: '1234',
        date: '2019-07-15',
      })
      .expect(201)
      .expect(
        {
          // Todo delete ID generated from comparision
          idMetric: 2,
          date: '2019-07-15',
          value: '1234',
          idSystem: 1,
          systemName: 'XP7_G11_58417',
          metricType: 'NET_TOTAL',
          idHostGroup: 1,
          hostGroupName: 'czchoct007',
        },
      ).then(() => {
        return request(app.getHttpServer())
          .post('/api/v1/systems/XP7_G11_58417/host-groups/czchoct007/metrics')
          .send({
            metricType: 'NET_TOTAL',
            value: '5555',
            date: '2019-07-15',
          }).expect(201)
          .expect({
              // Todo delete ID generated from comparision
              idMetric: 2,
              date: '2019-07-15',
              value: '5555',
              idSystem: 1,
              systemName: 'XP7_G11_58417',
              metricType: 'NET_TOTAL',
              idHostGroup: 1,
              hostGroupName: 'czchoct007',
            },
          );
      });

  });
  it('Create pool metric (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/systems/XP7_G11_58417/pools/Pool123/metrics')
      .send({
        metricType: 'PHYSICAL_CAPACITY',
        value: '655',
        date: '2019-07-13',
      })
      .expect(201)
      .expect(
        {
          // Todo delete ID generated from comparision
          idMetric: 1,
          date: '2019-07-13',
          value: '655',
          idSystem: 1,
          systemName: 'XP7_G11_58417',
          metricType: 'PHYSICAL_CAPACITY',
          idPool: 79,
          poolName: 'Pool123',
        },
      );
  });
  it('Create cha metric (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/systems/XP7_G11_58417/chas/Cha123/metrics')
      .send({
        metricType: 'IMBALANCE_ABSOLUT',
        value: '1',
        date: '2019-07-13',
      })
      .expect(201)
      .expect(
        {
          // Todo delete ID generated from comparision
          idMetric: 1,
          date: '2019-07-13',
          value: '1',
          idSystem: 1,
          systemName: 'XP7_G11_58417',
          metricType: 'IMBALANCE_ABSOLUT',
          idCha: 115,
          chaName: 'Cha123',
        },
      );
  });
  it('Create system metric (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/systems/XP7_G11_58417/metrics')
      .send({
        metricType: 'WORKLOAD',
        value: '2',
        peak: '5',
        date: '2019-07-13',
      })
      .expect(201)
      .expect(
        {
          // Todo delete ID generated from comparision
          idMetric: 1,
          date: '2019-07-13',
          value: '2',
          peak: '5',
          idSystem: 1,
          systemName: 'XP7_G11_58417',
          metricType: 'WORKLOAD',
        },
      );
  });
  it('Create port metric (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/systems/XP7_G11_58417/chas/CHA-1PC%2CCHA-33PC/ports/1D%2C2D/metrics')
      .send({
        metricType: 'IMBALANCE_EVENTS',
        value: '2',
        date: '2019-07-13',
      })
      .expect(201)
      .expect(
        {
          // Todo delete ID generated from comparision
          idMetric: 1,
          date: '2019-07-13',
          value: '2',
          idSystem: 1,
          systemName: 'XP7_G11_58417',
          metricType: 'IMBALANCE_EVENTS',
          idCha: 116,
          chaName: 'CHA-1PC,CHA-33PC',
          idPort: 1,
          portName: '1D,2D',
        },
      );
  });

  afterAll(async () => {
    await app.close();
  });
});
