import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { FallbackErrorFilter } from '../src/errors/filters/fallback-exception.filter';
import { HttpExceptionFilter } from '../src/errors/filters/http-exception.filter';
import { SaApiExceptionFilter } from '../src/errors/filters/sa-api-exception.filter';
import { HttpStatus } from '@nestjs/common';
import { StorageEntityType } from '../src/collector/dto/owner.dto';
import { ErrorCodeConst } from '../src/errors/error-code.enum';

describe('Storage Entity', () => {

  const SYSTEM_NAME = 'System_ABC';
  const POOL_NAME = 'Pool_1';
  const CHA_NAME = 'Cha_1';
  const HOST_GROUP_NAME = 'Host_group_1';
  const PORT_NAME = 'Port_1';
  const SYSTEM_SERIAL_NAME = 'Sys-123-abf';
  const POOL_SERIAL_NAME = 'Pool-XYZ-1';

  const systemPayload = {
    name: SYSTEM_NAME,
    type: StorageEntityType[StorageEntityType.SYSTEM],
    parentId: 2,
    serialNumber: SYSTEM_SERIAL_NAME,
  };

  const poolPayload = {
    name: POOL_NAME,
    type: StorageEntityType[StorageEntityType.POOL],
    parentId: 3,
    serialNumber: POOL_SERIAL_NAME,
  };

  const channelAdapterPayload = {
    name: CHA_NAME,
    type: StorageEntityType[StorageEntityType.ADAPTER],
    parentId: 3,
  };

  const hostGroupPayload = {
    name: HOST_GROUP_NAME,
    type: StorageEntityType[StorageEntityType.HOST_GROUP],
    parentId: 3,
  };

  const portPayload = {
    name: PORT_NAME,
    type: StorageEntityType[StorageEntityType.PORT],
    parentId: 8,
  };

  const validateResponse = (response, expected) => {
    console.log(response.body);
    expect(response.body).toEqual(expected);
  };

  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new FallbackErrorFilter(), new HttpExceptionFilter(), new SaApiExceptionFilter());
    await app.init();
  });

  afterAll(
    async () => app.close(),
  );

  it('Saving system storage entity data', () => {
      const expected = expect.objectContaining({
        externals: [],
        storageEntity: expect.objectContaining({
          id: expect.any(Number),
          name: SYSTEM_NAME,
          type: StorageEntityType[StorageEntityType.SYSTEM],
          serialNumber: SYSTEM_SERIAL_NAME,
        }),
      });
      return request(app.getHttpServer())
        .post('/api/v2/storage-entities')
        .send(systemPayload)
        .expect(HttpStatus.CREATED)
        .then((responses) => validateResponse(responses, expected));
    },
  );
  it('Saving same storage entity - CONFLICT', () => {
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
  it('Saving storage with unknown parent', () => {
      const modifiedPayload = systemPayload;
      modifiedPayload.parentId = -5;

      const expected = expect.objectContaining({
        code: ErrorCodeConst.ENTITY_NOT_FOUND.code,
        message: ErrorCodeConst.ENTITY_NOT_FOUND.message,
      });

      return request(app.getHttpServer())
        .post('/api/v2/storage-entities')
        .send(modifiedPayload)
        .expect(400)
        .then((responses) => validateResponse(responses, expected));
    },
  );
  it('Saving pool entity data', () => {
      const expected = expect.objectContaining({
        externals: [],
        storageEntity: expect.objectContaining({
          id: expect.any(Number),
          name: POOL_NAME,
          type: StorageEntityType[StorageEntityType.POOL],
          serialNumber: POOL_SERIAL_NAME,
        }),
      });
      return request(app.getHttpServer())
        .post('/api/v2/storage-entities')
        .send(poolPayload)
        .expect(HttpStatus.CREATED)
        .then((responses) => validateResponse(responses, expected));
    },
  );

  it('Saving channel adapter entity data', () => {
      const expected = expect.objectContaining({
        externals: [],
        storageEntity: expect.objectContaining({
          id: expect.any(Number),
          name: CHA_NAME,
          type: StorageEntityType[StorageEntityType.ADAPTER],
        }),
      });

      return request(app.getHttpServer())
        .post('/api/v2/storage-entities')
        .send(channelAdapterPayload)
        .expect(HttpStatus.CREATED)
        .then((responses) => validateResponse(responses, expected));
    },
  );
  it('Saving host group entity data', () => {
      const expected = expect.objectContaining({
        externals: [],
        storageEntity: expect.objectContaining({
          id: expect.any(Number),
          name: HOST_GROUP_NAME,
          type: StorageEntityType[StorageEntityType.HOST_GROUP],
        }),
      });

      return request(app.getHttpServer())
        .post('/api/v2/storage-entities')
        .send(hostGroupPayload)
        .expect(HttpStatus.CREATED)
        .then((responses) => validateResponse(responses, expected));
    },
  );

  it('Saving port entity data', () => {
      const expected = expect.objectContaining({
        externals: [],
        storageEntity: expect.objectContaining({
          id: expect.any(Number),
          name: PORT_NAME,
          type: StorageEntityType[StorageEntityType.PORT],
        }),
      });

      return request(app.getHttpServer())
        .post('/api/v2/storage-entities')
        .send(portPayload)
        .expect(HttpStatus.CREATED)
        .then((responses) => validateResponse(responses, expected));
    },
  );
});
