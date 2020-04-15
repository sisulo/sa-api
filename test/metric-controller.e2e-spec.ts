import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { MetricType } from '../src/collector/enums/metric-type.enum';
import { StorageEntityType } from '../src/collector/dto/owner.dto';
import { ComponentStatus } from '../src/collector/enums/component.status';
import { HttpStatus } from '@nestjs/common';
import { urlencoded } from 'express';

describe('Collector', () => {
  let app;
  const SYSTEM_NAME = 'XP7_G11_58417';
  const POOL_NAME = 'Pool123';
  const HOST_GROUP_NAME = 'czchoct007';
  const ADAPTER_NAME = 'CHA-1PC,CHA-33PC';
  const PORT_NAME = '1D,2D';
  const DATE = '2019-07-15';
  const DATE_2 = '2019-07-16';
  const METRIC_VALUE = 12345;
  const poolMetricPayload = {
    metricType: MetricType[MetricType.PHYSICAL_CAPACITY],
    value: METRIC_VALUE,
    date: DATE,
  };
  const hostGroupMetricPayload = {
    metricType: MetricType[MetricType.NET_TOTAL],
    value: METRIC_VALUE,
    date: DATE,
  };

  const adapterMetricPayload = {
    metricType: MetricType[MetricType.IMBALANCE_ABSOLUT],
    value: METRIC_VALUE,
    date: DATE,
  };

  const systemMetricPayload = {
    metricType: MetricType[MetricType.WORKLOAD],
    value: METRIC_VALUE,
    peak: 5,
    date: DATE,
  };

  const portMetricPayload = {
    metricType: MetricType[MetricType.IMBALANCE_EVENTS],
    value: METRIC_VALUE,
    date: DATE,
  };
  const validateResponse = (response, expected) => {
    console.log(response.body);
    expect(response.body).toEqual(expected);
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Create pool metric (POST)', () => {
    const expected = expect.objectContaining({
      idMetric: expect.any(Number),
      date: DATE,
      value: METRIC_VALUE,
      metricType: MetricType[MetricType.PHYSICAL_CAPACITY],
      owner: expect.objectContaining({
        id: expect.any(Number),
        name: POOL_NAME,
        type: StorageEntityType[StorageEntityType.POOL],
        status: ComponentStatus[ComponentStatus.ACTIVE],
        parent: expect.objectContaining({
          id: expect.any(Number),
          name: SYSTEM_NAME,
          type: StorageEntityType[StorageEntityType.SYSTEM],
          status: ComponentStatus[ComponentStatus.ACTIVE],
        }),
      }),
    });
    return request(app.getHttpServer())
      .post(`/api/v1/systems/${SYSTEM_NAME}/pools/${POOL_NAME}/metrics`)
      .send(poolMetricPayload)
      .expect(HttpStatus.CREATED)
      .then((responses) => validateResponse(responses, expected));
  });
  it('Update pool metric (POST)', () => {
    poolMetricPayload.date = DATE_2;
    const expected = expect.objectContaining({
      idMetric: expect.any(Number),
      date: DATE_2,
      value: METRIC_VALUE,
      metricType: MetricType[MetricType.PHYSICAL_CAPACITY],
      owner: expect.objectContaining({
        id: expect.any(Number),
        name: POOL_NAME,
        type: StorageEntityType[StorageEntityType.POOL],
        status: ComponentStatus[ComponentStatus.ACTIVE],
        parent: expect.objectContaining({
          id: expect.any(Number),
          name: SYSTEM_NAME,
          type: StorageEntityType[StorageEntityType.SYSTEM],
          status: ComponentStatus[ComponentStatus.ACTIVE],
        }),
      }),
    });
    return request(app.getHttpServer())
      .post(`/api/v1/systems/${SYSTEM_NAME}/pools/${POOL_NAME}/metrics`)
      .send(poolMetricPayload)
      .expect(HttpStatus.CREATED)
      .then(async (response) => {
        validateResponse(response, expected);
        poolMetricPayload.value = 555;
        await request(app.getHttpServer())
          .post(`/api/v1/systems/${SYSTEM_NAME}/pools/${POOL_NAME}/metrics`)
          .send(poolMetricPayload)
          .expect(HttpStatus.CREATED)
          .then((secondResponse) => {
            expect(secondResponse.body.id).toEqual(response.body.id);
            expect(secondResponse.body.value).toEqual(555);
          });
      });
  });
  // it('Update system status (POST)', () => {
  //   return request(app.getHttpServer())
  //     .put('/api/v1/systems/XP7_G11_58417/status')
  //     .send({
  //       status: 'INACTIVE',
  //     })
  //     .expect(200)
  //     .expect(
  //       {
  //         // Todo delete ID generated from comparision
  //         storageEntity: {
  //           id: 1,
  //           name: 'XP7_G11_58417',
  //           status: 'INACTIVE',
  //           type: 'SYSTEM',
  //         },
  //         externals: [],
  //       },
  //     );
  // });
  it('Create host group metric (POST)', () => {
    const expected = expect.objectContaining({
        idMetric: expect.any(Number),
        date: DATE,
        value: METRIC_VALUE,
        metricType: MetricType[MetricType.NET_TOTAL],
        owner: expect.objectContaining({
          id: expect.any(Number),
          name: HOST_GROUP_NAME,
          status: ComponentStatus[ComponentStatus.ACTIVE],
          type: StorageEntityType[StorageEntityType.HOST_GROUP],
          parent: expect.objectContaining({
            id: expect.any(Number),
            name: SYSTEM_NAME,
            status: ComponentStatus[ComponentStatus.ACTIVE],
            type: StorageEntityType[StorageEntityType.SYSTEM],
          }),
        }),
      },
    );
    return request(app.getHttpServer())
      .post(`/api/v1/systems/${SYSTEM_NAME}/host-groups/${HOST_GROUP_NAME}/metrics`)
      .send(hostGroupMetricPayload)
      .expect(HttpStatus.CREATED)
      .then((response) => validateResponse(response, expected));
  });
  it('Create adapter metric (POST)', () => {
    const expected = expect.objectContaining({
      // Todo delete ID generated from comparision
      idMetric: expect.any(Number),
      date: DATE,
      value: METRIC_VALUE,
      metricType: MetricType[MetricType.IMBALANCE_ABSOLUT],
      owner: expect.objectContaining({
        id: expect.any(Number),
        name: ADAPTER_NAME,
        type: StorageEntityType[StorageEntityType.ADAPTER],
        status: ComponentStatus[ComponentStatus.ACTIVE],
        parent: expect.objectContaining({
          id: expect.any(Number),
          name: SYSTEM_NAME,
          type: StorageEntityType[StorageEntityType.SYSTEM],
          status: ComponentStatus[ComponentStatus.ACTIVE],
        }),
      }),
    });
    return request(app.getHttpServer())
      .post(`/api/v1/systems/${SYSTEM_NAME}/chas/${ADAPTER_NAME}/metrics`)
      .send(adapterMetricPayload)
      .expect(201)
      .then((response) => validateResponse(response, expected));
  });
  it('Create system metric (POST)', () => {
    const expected = expect.objectContaining({
      // Todo delete ID generated from comparision
      idMetric: expect.any(Number),
      date: DATE,
      value: METRIC_VALUE,
      peak: 5,
      metricType: MetricType[MetricType.WORKLOAD],
      owner: expect.objectContaining({
        id: expect.any(Number),
        name: SYSTEM_NAME,
        type: StorageEntityType[StorageEntityType.SYSTEM],
        status: ComponentStatus[ComponentStatus.ACTIVE],
      }),
    });
    return request(app.getHttpServer())
      .post(`/api/v1/systems/${SYSTEM_NAME}/metrics`)
      .send(systemMetricPayload)
      .expect(201)
      .then((response) => validateResponse(response, expected));
  });
  it('Create port metric (POST)', () => {
    const expected = expect.objectContaining({
      idMetric: expect.any(Number),
      date: DATE,
      value: METRIC_VALUE,
      metricType: MetricType[MetricType.IMBALANCE_EVENTS],
      owner: expect.objectContaining({
        id: expect.any(Number),
        name: PORT_NAME,
        type: StorageEntityType[StorageEntityType.PORT],
        status: ComponentStatus[ComponentStatus.ACTIVE],
        parent: expect.objectContaining({
          id: expect.any(Number),
          name: ADAPTER_NAME,
          type: StorageEntityType[StorageEntityType.ADAPTER],
          status: ComponentStatus[ComponentStatus.ACTIVE],
          parent: expect.objectContaining({
            id: expect.any(Number),
            name: SYSTEM_NAME,
            type: StorageEntityType[StorageEntityType.SYSTEM],
            status: ComponentStatus[ComponentStatus.ACTIVE],
          }),
        }),
      }),
    });
    return request(app.getHttpServer())
      .post(`/api/v1/systems/${SYSTEM_NAME}/chas/${encodeURIComponent(ADAPTER_NAME)}/ports/${encodeURIComponent(PORT_NAME)}/metrics`)
      .send(portMetricPayload)
      .expect(201)
      .then((response) => validateResponse(response, expected));
  });
  //
  // it('Update system status (POST)', () => {
  //   return request(app.getHttpServer())
  //     .put('/api/v1/systems/XP7_G11_58417/status')
  //     .send({
  //       status: 'INACTIVE',
  //     })
  //     .expect(200)
  //     .expect(
  //       {
  //         // Todo delete ID generated from comparision
  //         storageEntity: {
  //           id: 1,
  //           name: 'XP7_G11_58417',
  //           status: 'INACTIVE',
  //           type: 'SYSTEM',
  //         },
  //         externals: [],
  //       },
  //     );
  // });
  //
  // it('Update pool status (POST)', () => {
  //   return request(app.getHttpServer())
  //     .put('/api/v1/systems/XP7_G11_58417/pools/Pool123/status')
  //     .send({
  //       status: 'INACTIVE',
  //     })
  //     .expect(200)
  //     .expect(
  //       {
  //         // Todo delete ID generated from comparision
  //         storageEntity: {
  //           id: 79,
  //           name: 'Pool123',
  //           status: 'INACTIVE',
  //           type: 'POOL',
  //           parent: {
  //             id: 1,
  //             name: 'XP7_G11_58417',
  //             type: 'SYSTEM',
  //             status: 'INACTIVE',
  //           },
  //         },
  //         externals: [],
  //       },
  //     );
  // });
  // it('Update host group status (POST)', () => {
  //   return request(app.getHttpServer())
  //     .put('/api/v1/systems/XP7_G11_58417/host-groups/czchoct007/status')
  //     .send({
  //       status: 'INACTIVE',
  //     })
  //     .expect(200)
  //     .expect(
  //       {
  //         // Todo delete ID generated from comparision
  //         storageEntity: {
  //           id: 1,
  //           name: 'czchoct007',
  //           status: 'INACTIVE',
  //           type: 'HOST_GROUP',
  //           parent: {
  //             id: 1,
  //             name: 'XP7_G11_58417',
  //             type: 'SYSTEM',
  //             status: 'INACTIVE',
  //           },
  //         },
  //         externals: [],
  //       },
  //     );
  // });
  // it('Update adapter status (POST)', () => {
  //   return request(app.getHttpServer())
  //     .put('/api/v1/systems/XP7_G11_58417/chas/Cha123/status')
  //     .send({
  //       status: 'INACTIVE',
  //     })
  //     .expect(200)
  //     .expect(
  //       {
  //         // Todo delete ID generated from comparision
  //         storageEntity: {
  //           id: 115,
  //           name: 'Cha123',
  //           status: 'INACTIVE',
  //           type: 'ADAPTER',
  //           parent: {
  //             id: 1,
  //             name: 'XP7_G11_58417',
  //             type: 'SYSTEM',
  //             status: 'INACTIVE',
  //           },
  //         },
  //         externals: [],
  //       },
  //     );
  // });
  // it('Update adapter status when not exists(PUT)', () => {
  //   return request(app.getHttpServer())
  //     .put('/api/v1/systems/XP7_G11_58417/chas/ChaXXX/status')
  //     .send({
  //       status: 'INACTIVE',
  //     })
  //     .expect(404);
  // });
  // it('Update port status (POST)', () => {
  //   return request(app.getHttpServer())
  //     .put('/api/v1/systems/XP7_G11_58417/chas/CHA-1PC%2CCHA-33PC/ports/1D%2C2D/status')
  //     .send({
  //       status: 'INACTIVE',
  //     })
  //     .expect(200)
  //     .expect(
  //       {
  //         // Todo delete ID generated from comparision
  //         storageEntity: {
  //           id: 1,
  //           name: '1D,2D',
  //           type: 'PORT',
  //           status: 'INACTIVE',
  //           parent: {
  //             id: 116,
  //             name: 'CHA-1PC,CHA-33PC',
  //             status: 'ACTIVE',
  //             type: 'ADAPTER',
  //             parent: {
  //               id: 1,
  //               name: 'XP7_G11_58417',
  //               type: 'SYSTEM',
  //               status: 'INACTIVE',
  //             },
  //           },
  //         },
  //         externals: [],
  //       },
  //     );
  // });
  afterAll(async () => {
    await app.close();
  });
});
