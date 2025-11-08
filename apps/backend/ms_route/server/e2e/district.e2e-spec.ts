import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { DistrictDTO } from '../src/service/dto/district.dto';
import { DistrictService } from '../src/service/district.service';

describe('District Controller', () => {
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
      .overrideProvider(DistrictService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all districts ', async () => {
    const getEntities: DistrictDTO[] = (await request(app.getHttpServer()).get('/api/districts').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET districts by id', async () => {
    const getEntity: DistrictDTO = (await request(app.getHttpServer()).get(`/api/districts/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create districts', async () => {
    const createdEntity: DistrictDTO = (await request(app.getHttpServer()).post('/api/districts').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update districts', async () => {
    const updatedEntity: DistrictDTO = (await request(app.getHttpServer()).put('/api/districts').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update districts from id', async () => {
    const updatedEntity: DistrictDTO = (
      await request(app.getHttpServer()).put(`/api/districts/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE districts', async () => {
    const deletedEntity: DistrictDTO = (await request(app.getHttpServer()).delete(`/api/districts/${entityMock.id}`).expect(204)).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
