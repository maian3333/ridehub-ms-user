import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { ConditionByDateDTO } from '../src/service/dto/condition-by-date.dto';
import { ConditionByDateService } from '../src/service/condition-by-date.service';

describe('ConditionByDate Controller', () => {
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
      .overrideProvider(ConditionByDateService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all condition-by-dates ', async () => {
    const getEntities: ConditionByDateDTO[] = (await request(app.getHttpServer()).get('/api/condition-by-dates').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET condition-by-dates by id', async () => {
    const getEntity: ConditionByDateDTO = (await request(app.getHttpServer()).get(`/api/condition-by-dates/${entityMock.id}`).expect(200))
      .body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create condition-by-dates', async () => {
    const createdEntity: ConditionByDateDTO = (
      await request(app.getHttpServer()).post('/api/condition-by-dates').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update condition-by-dates', async () => {
    const updatedEntity: ConditionByDateDTO = (
      await request(app.getHttpServer()).put('/api/condition-by-dates').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update condition-by-dates from id', async () => {
    const updatedEntity: ConditionByDateDTO = (
      await request(app.getHttpServer()).put(`/api/condition-by-dates/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE condition-by-dates', async () => {
    const deletedEntity: ConditionByDateDTO = (
      await request(app.getHttpServer()).delete(`/api/condition-by-dates/${entityMock.id}`).expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
