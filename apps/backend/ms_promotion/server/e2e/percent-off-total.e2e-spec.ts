import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { PercentOffTotalDTO } from '../src/service/dto/percent-off-total.dto';
import { PercentOffTotalService } from '../src/service/percent-off-total.service';

describe('PercentOffTotal Controller', () => {
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
      .overrideProvider(PercentOffTotalService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all percent-off-totals ', async () => {
    const getEntities: PercentOffTotalDTO[] = (await request(app.getHttpServer()).get('/api/percent-off-totals').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET percent-off-totals by id', async () => {
    const getEntity: PercentOffTotalDTO = (await request(app.getHttpServer()).get(`/api/percent-off-totals/${entityMock.id}`).expect(200))
      .body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create percent-off-totals', async () => {
    const createdEntity: PercentOffTotalDTO = (
      await request(app.getHttpServer()).post('/api/percent-off-totals').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update percent-off-totals', async () => {
    const updatedEntity: PercentOffTotalDTO = (
      await request(app.getHttpServer()).put('/api/percent-off-totals').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update percent-off-totals from id', async () => {
    const updatedEntity: PercentOffTotalDTO = (
      await request(app.getHttpServer()).put(`/api/percent-off-totals/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE percent-off-totals', async () => {
    const deletedEntity: PercentOffTotalDTO = (
      await request(app.getHttpServer()).delete(`/api/percent-off-totals/${entityMock.id}`).expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
