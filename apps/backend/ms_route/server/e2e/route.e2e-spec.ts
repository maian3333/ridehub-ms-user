import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { RouteDTO } from '../src/service/dto/route.dto';
import { RouteService } from '../src/service/route.service';

describe('Route Controller', () => {
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
      .overrideProvider(RouteService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all routes ', async () => {
    const getEntities: RouteDTO[] = (await request(app.getHttpServer()).get('/api/routes').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET routes by id', async () => {
    const getEntity: RouteDTO = (await request(app.getHttpServer()).get(`/api/routes/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create routes', async () => {
    const createdEntity: RouteDTO = (await request(app.getHttpServer()).post('/api/routes').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update routes', async () => {
    const updatedEntity: RouteDTO = (await request(app.getHttpServer()).put('/api/routes').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update routes from id', async () => {
    const updatedEntity: RouteDTO = (await request(app.getHttpServer()).put(`/api/routes/${entityMock.id}`).send(entityMock).expect(201))
      .body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE routes', async () => {
    const deletedEntity: RouteDTO = (await request(app.getHttpServer()).delete(`/api/routes/${entityMock.id}`).expect(204)).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
