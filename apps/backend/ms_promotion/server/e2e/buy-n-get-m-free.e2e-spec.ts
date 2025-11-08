import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { BuyNGetMFreeDTO } from '../src/service/dto/buy-n-get-m-free.dto';
import { BuyNGetMFreeService } from '../src/service/buy-n-get-m-free.service';

describe('BuyNGetMFree Controller', () => {
  let app: INestApplication;

  const authGuardMock = { canActivate: (): any => true };
  const rolesGuardMock = { canActivate: (): any => true };
  const entityMock: any = {
    id: 'entityId',
  };

  const serviceMock = {
    findById: (): any => entityMock,
    findAndCount: (): any => [entityMock, 0],
    save: (): any => entityMock,
    update: (): any => entityMock,
    deleteById: (): any => entityMock,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(authGuardMock)
      .overrideGuard(RolesGuard)
      .useValue(rolesGuardMock)
      .overrideProvider(BuyNGetMFreeService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all buy-n-get-m-frees ', async () => {
    const getEntities: BuyNGetMFreeDTO[] = (await request(app.getHttpServer()).get('/api/buy-n-get-m-frees').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET buy-n-get-m-frees by id', async () => {
    const getEntity: BuyNGetMFreeDTO = (await request(app.getHttpServer()).get(`/api/buy-n-get-m-frees/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create buy-n-get-m-frees', async () => {
    const createdEntity: BuyNGetMFreeDTO = (await request(app.getHttpServer()).post('/api/buy-n-get-m-frees').send(entityMock).expect(201))
      .body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update buy-n-get-m-frees', async () => {
    const updatedEntity: BuyNGetMFreeDTO = (await request(app.getHttpServer()).put('/api/buy-n-get-m-frees').send(entityMock).expect(201))
      .body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update buy-n-get-m-frees from id', async () => {
    const updatedEntity: BuyNGetMFreeDTO = (
      await request(app.getHttpServer()).put(`/api/buy-n-get-m-frees/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE buy-n-get-m-frees', async () => {
    const deletedEntity: BuyNGetMFreeDTO = (
      await request(app.getHttpServer()).delete(`/api/buy-n-get-m-frees/${entityMock.id}`).expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
