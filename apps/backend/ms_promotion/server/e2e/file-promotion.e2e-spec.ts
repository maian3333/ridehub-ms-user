import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { FilePromotionDTO } from '../src/service/dto/file-promotion.dto';
import { FilePromotionService } from '../src/service/file-promotion.service';

describe('FilePromotion Controller', () => {
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
      .overrideProvider(FilePromotionService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all file-promotions ', async () => {
    const getEntities: FilePromotionDTO[] = (await request(app.getHttpServer()).get('/api/file-promotions').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET file-promotions by id', async () => {
    const getEntity: FilePromotionDTO = (await request(app.getHttpServer()).get(`/api/file-promotions/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create file-promotions', async () => {
    const createdEntity: FilePromotionDTO = (await request(app.getHttpServer()).post('/api/file-promotions').send(entityMock).expect(201))
      .body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update file-promotions', async () => {
    const updatedEntity: FilePromotionDTO = (await request(app.getHttpServer()).put('/api/file-promotions').send(entityMock).expect(201))
      .body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update file-promotions from id', async () => {
    const updatedEntity: FilePromotionDTO = (
      await request(app.getHttpServer()).put(`/api/file-promotions/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE file-promotions', async () => {
    const deletedEntity: FilePromotionDTO = (await request(app.getHttpServer()).delete(`/api/file-promotions/${entityMock.id}`).expect(204))
      .body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
