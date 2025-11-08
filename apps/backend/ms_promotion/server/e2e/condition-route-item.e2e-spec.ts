import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { ConditionRouteItemDTO } from '../src/service/dto/condition-route-item.dto';
import { ConditionRouteItemService } from '../src/service/condition-route-item.service';

describe('ConditionRouteItem Controller', () => {
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
      .overrideProvider(ConditionRouteItemService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all condition-route-items ', async () => {
    const getEntities: ConditionRouteItemDTO[] = (await request(app.getHttpServer()).get('/api/condition-route-items').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET condition-route-items by id', async () => {
    const getEntity: ConditionRouteItemDTO = (
      await request(app.getHttpServer()).get(`/api/condition-route-items/${entityMock.id}`).expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create condition-route-items', async () => {
    const createdEntity: ConditionRouteItemDTO = (
      await request(app.getHttpServer()).post('/api/condition-route-items').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update condition-route-items', async () => {
    const updatedEntity: ConditionRouteItemDTO = (
      await request(app.getHttpServer()).put('/api/condition-route-items').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update condition-route-items from id', async () => {
    const updatedEntity: ConditionRouteItemDTO = (
      await request(app.getHttpServer()).put(`/api/condition-route-items/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE condition-route-items', async () => {
    const deletedEntity: ConditionRouteItemDTO = (
      await request(app.getHttpServer()).delete(`/api/condition-route-items/${entityMock.id}`).expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
