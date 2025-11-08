import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { ConditionDateItemDTO } from '../src/service/dto/condition-date-item.dto';
import { ConditionDateItemService } from '../src/service/condition-date-item.service';

describe('ConditionDateItem Controller', () => {
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
      .overrideProvider(ConditionDateItemService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all condition-date-items ', async () => {
    const getEntities: ConditionDateItemDTO[] = (await request(app.getHttpServer()).get('/api/condition-date-items').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET condition-date-items by id', async () => {
    const getEntity: ConditionDateItemDTO = (
      await request(app.getHttpServer()).get(`/api/condition-date-items/${entityMock.id}`).expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create condition-date-items', async () => {
    const createdEntity: ConditionDateItemDTO = (
      await request(app.getHttpServer()).post('/api/condition-date-items').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update condition-date-items', async () => {
    const updatedEntity: ConditionDateItemDTO = (
      await request(app.getHttpServer()).put('/api/condition-date-items').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update condition-date-items from id', async () => {
    const updatedEntity: ConditionDateItemDTO = (
      await request(app.getHttpServer()).put(`/api/condition-date-items/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE condition-date-items', async () => {
    const deletedEntity: ConditionDateItemDTO = (
      await request(app.getHttpServer()).delete(`/api/condition-date-items/${entityMock.id}`).expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
