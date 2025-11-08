import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { ConditionLocationItemDTO } from '../src/service/dto/condition-location-item.dto';
import { ConditionLocationItemService } from '../src/service/condition-location-item.service';

describe('ConditionLocationItem Controller', () => {
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
      .overrideProvider(ConditionLocationItemService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all condition-location-items ', async () => {
    const getEntities: ConditionLocationItemDTO[] = (await request(app.getHttpServer()).get('/api/condition-location-items').expect(200))
      .body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET condition-location-items by id', async () => {
    const getEntity: ConditionLocationItemDTO = (
      await request(app.getHttpServer()).get(`/api/condition-location-items/${entityMock.id}`).expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create condition-location-items', async () => {
    const createdEntity: ConditionLocationItemDTO = (
      await request(app.getHttpServer()).post('/api/condition-location-items').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update condition-location-items', async () => {
    const updatedEntity: ConditionLocationItemDTO = (
      await request(app.getHttpServer()).put('/api/condition-location-items').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update condition-location-items from id', async () => {
    const updatedEntity: ConditionLocationItemDTO = (
      await request(app.getHttpServer()).put(`/api/condition-location-items/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE condition-location-items', async () => {
    const deletedEntity: ConditionLocationItemDTO = (
      await request(app.getHttpServer()).delete(`/api/condition-location-items/${entityMock.id}`).expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
