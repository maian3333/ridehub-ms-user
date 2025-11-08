import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { ConditionByRouteDTO } from '../src/service/dto/condition-by-route.dto';
import { ConditionByRouteService } from '../src/service/condition-by-route.service';

describe('ConditionByRoute Controller', () => {
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
      .overrideProvider(ConditionByRouteService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all condition-by-routes ', async () => {
    const getEntities: ConditionByRouteDTO[] = (await request(app.getHttpServer()).get('/api/condition-by-routes').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET condition-by-routes by id', async () => {
    const getEntity: ConditionByRouteDTO = (await request(app.getHttpServer()).get(`/api/condition-by-routes/${entityMock.id}`).expect(200))
      .body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create condition-by-routes', async () => {
    const createdEntity: ConditionByRouteDTO = (
      await request(app.getHttpServer()).post('/api/condition-by-routes').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update condition-by-routes', async () => {
    const updatedEntity: ConditionByRouteDTO = (
      await request(app.getHttpServer()).put('/api/condition-by-routes').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update condition-by-routes from id', async () => {
    const updatedEntity: ConditionByRouteDTO = (
      await request(app.getHttpServer()).put(`/api/condition-by-routes/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE condition-by-routes', async () => {
    const deletedEntity: ConditionByRouteDTO = (
      await request(app.getHttpServer()).delete(`/api/condition-by-routes/${entityMock.id}`).expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
