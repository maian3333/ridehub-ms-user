import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { WardDTO } from '../src/service/dto/ward.dto';
import { WardService } from '../src/service/ward.service';

describe('Ward Controller', () => {
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
      .overrideProvider(WardService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all wards ', async () => {
    const getEntities: WardDTO[] = (await request(app.getHttpServer()).get('/api/wards').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET wards by id', async () => {
    const getEntity: WardDTO = (await request(app.getHttpServer()).get(`/api/wards/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create wards', async () => {
    const createdEntity: WardDTO = (await request(app.getHttpServer()).post('/api/wards').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update wards', async () => {
    const updatedEntity: WardDTO = (await request(app.getHttpServer()).put('/api/wards').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update wards from id', async () => {
    const updatedEntity: WardDTO = (await request(app.getHttpServer()).put(`/api/wards/${entityMock.id}`).send(entityMock).expect(201))
      .body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE wards', async () => {
    const deletedEntity: WardDTO = (await request(app.getHttpServer()).delete(`/api/wards/${entityMock.id}`).expect(204)).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
