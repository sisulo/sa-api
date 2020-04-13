import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { FallbackErrorFilter } from '../src/errors/filters/fallback-exception.filter';
import { HttpExceptionFilter } from '../src/errors/filters/http-exception.filter';
import { SaApiExceptionFilter } from '../src/errors/filters/sa-api-exception.filter';
import { ErrorCodeConst } from '../src/errors/error-code.enum';
import { HttpStatus } from '@nestjs/common';
import { StorageEntityType } from '../src/collector/dto/owner.dto';

const systemPayload = {
  name: 'System_ABC',
  type: StorageEntityType[StorageEntityType.SYSTEM],
  parentId: 1,
};

const poolPayload = {
  name: 'Pool_1',
  type: StorageEntityType[StorageEntityType.POOL],
  parentId: 1,
};

const channelAdapterPayload = {
  name: 'Cha_1',
  type: StorageEntityType[StorageEntityType.ADAPTER],
  parentId: 1,
};

const hostGroupPayload = {
  name: 'Host_group_1',
  type: StorageEntityType[StorageEntityType.HOST_GROUP],
  parentId: 1,
};

const portPayload = {
  name: 'Port_1',
  type: StorageEntityType[StorageEntityType.PORT],
  parentId: 1,
};

const validateResponse = (err, res, expected, done) => {
  if (err !== undefined) {
    return done(err);
  }
  expect(res.body).toEqual(expected);
  return done();
};

describe('Storage Entity', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new FallbackErrorFilter(), new HttpExceptionFilter(), new SaApiExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Saving system storage entity data', (done) => {
      const expected = expect.objectContaining({
        externals: [],
        storageEntity: expect.objectContaining({
          id: expect.any(Number),
          name: 'System_ABC',
          type: StorageEntityType[StorageEntityType.SYSTEM],
        }),
      });
      request(app.getHttpServer())
        .post('/api/v2/storage-entities')
        .send(systemPayload)
        .expect(HttpStatus.CREATED)
        .end((err, res) => validateResponse(err, res, expected, done));
    },
  );
  it('Saving same storage entity - CONFLICT', async () => {
      const modifiedPayload = systemPayload;
      modifiedPayload.name = 'System_2';

      return request(app.getHttpServer())
        .post('/api/v2/storage-entities')
        .send(systemPayload)
        .expect(HttpStatus.CREATED)
        .then(() => {
          request(app.getHttpServer())
            .post('/api/v2/storage-entities')
            .send(systemPayload)
            .expect(HttpStatus.CONFLICT);
        });

    },
  );
  it('Saving storage with unknown parent', (done) => {
      const modifiedPayload = systemPayload;
      modifiedPayload.parentId = -5;

      const expected = expect.objectContaining({
        code: ErrorCodeConst.ENTITY_NOT_FOUND.code,
        message: ErrorCodeConst.ENTITY_NOT_FOUND.message,
      });

      request(app.getHttpServer())
        .post('/api/v2/storage-entities')
        .send(modifiedPayload)
        .expect(400)
        .end((err, res) => validateResponse(err, res, expected, done));
    },
  );

  it('Saving pool entity data', (done) => {
      const expectedBody = expect.objectContaining({
        externals: [],
        storageEntity: expect.objectContaining({
          id: expect.any(Number),
          name: 'Pool_1',
          type: StorageEntityType[StorageEntityType.POOL],
        }),
      });
      request(app.getHttpServer())
        .post('/api/v2/storage-entities')
        .send(poolPayload)
        .expect(HttpStatus.CREATED)
        .end((err, res) => validateResponse(err, res, expectedBody, done),
        );
    },
  );

  it('Saving channel adapter entity data', (done) => {
      const expected = expect.objectContaining({
        externals: [],
        storageEntity: expect.objectContaining({
          id: expect.any(Number),
          name: 'Cha_1',
          type: StorageEntityType[StorageEntityType.ADAPTER],
        }),
      });

      request(app.getHttpServer())
        .post('/api/v2/storage-entities')
        .send(channelAdapterPayload)
        .expect(HttpStatus.CREATED)
        .end((err, res) => validateResponse(err, res, expected, done),
        );
    },
  );
  it('Saving host group entity data', (done) => {
      const expected = expect.objectContaining({
        externals: [],
        storageEntity: expect.objectContaining({
          id: expect.any(Number),
          name: 'Host_group_1',
          type: StorageEntityType[StorageEntityType.HOST_GROUP],
        }),
      });

      return request(app.getHttpServer())
        .post('/api/v2/storage-entities')
        .send(hostGroupPayload)
        .expect(HttpStatus.CREATED)
        .end((err, res) => validateResponse(err, res, expected, done));
    },
  );

  it('Saving port entity data', (done) => {
      const expected = expect.objectContaining({
        externals: [],
        storageEntity: expect.objectContaining({
          id: expect.any(Number),
          name: 'Port_1',
          type: StorageEntityType[StorageEntityType.PORT],
        }),
      });

      return request(app.getHttpServer())
        .post('/api/v2/storage-entities')
        .send(portPayload)
        .expect(HttpStatus.CREATED)
        .end((err, res) => validateResponse(err, res, expected, done));
    },
  );
});
