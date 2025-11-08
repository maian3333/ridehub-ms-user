import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { ProvinceDTO } from '../src/service/dto/province.dto';
import { ProvinceService } from '../src/service/province.service';

describe('Province Controller', () => {
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
      .overrideProvider(ProvinceService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all provinces ', async () => {
    const getEntities: ProvinceDTO[] = (await request(app.getHttpServer()).get('/api/provinces').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET provinces by id', async () => {
    const getEntity: ProvinceDTO = (await request(app.getHttpServer()).get(`/api/provinces/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create provinces', async () => {
    const createdEntity: ProvinceDTO = (await request(app.getHttpServer()).post('/api/provinces').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update provinces', async () => {
    const updatedEntity: ProvinceDTO = (await request(app.getHttpServer()).put('/api/provinces').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update provinces from id', async () => {
    const updatedEntity: ProvinceDTO = (
      await request(app.getHttpServer()).put(`/api/provinces/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE provinces', async () => {
    const deletedEntity: ProvinceDTO = (await request(app.getHttpServer()).delete(`/api/provinces/${entityMock.id}`).expect(204)).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
