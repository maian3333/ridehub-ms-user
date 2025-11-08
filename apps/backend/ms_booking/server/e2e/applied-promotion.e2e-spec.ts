import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { AppliedPromotionDTO } from '../src/service/dto/applied-promotion.dto';
import { AppliedPromotionService } from '../src/service/applied-promotion.service';

describe('AppliedPromotion Controller', () => {
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
      .overrideProvider(AppliedPromotionService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all applied-promotions ', async () => {
    const getEntities: AppliedPromotionDTO[] = (await request(app.getHttpServer()).get('/api/applied-promotions').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET applied-promotions by id', async () => {
    const getEntity: AppliedPromotionDTO = (await request(app.getHttpServer()).get(`/api/applied-promotions/${entityMock.id}`).expect(200))
      .body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create applied-promotions', async () => {
    const createdEntity: AppliedPromotionDTO = (
      await request(app.getHttpServer()).post('/api/applied-promotions').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update applied-promotions', async () => {
    const updatedEntity: AppliedPromotionDTO = (
      await request(app.getHttpServer()).put('/api/applied-promotions').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update applied-promotions from id', async () => {
    const updatedEntity: AppliedPromotionDTO = (
      await request(app.getHttpServer()).put(`/api/applied-promotions/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE applied-promotions', async () => {
    const deletedEntity: AppliedPromotionDTO = (
      await request(app.getHttpServer()).delete(`/api/applied-promotions/${entityMock.id}`).expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
