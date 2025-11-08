import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { FileRouteDTO } from '../src/service/dto/file-route.dto';
import { FileRouteService } from '../src/service/file-route.service';

describe('FileRoute Controller', () => {
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
      .overrideProvider(FileRouteService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all file-routes ', async () => {
    const getEntities: FileRouteDTO[] = (await request(app.getHttpServer()).get('/api/file-routes').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET file-routes by id', async () => {
    const getEntity: FileRouteDTO = (await request(app.getHttpServer()).get(`/api/file-routes/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create file-routes', async () => {
    const createdEntity: FileRouteDTO = (await request(app.getHttpServer()).post('/api/file-routes').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update file-routes', async () => {
    const updatedEntity: FileRouteDTO = (await request(app.getHttpServer()).put('/api/file-routes').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update file-routes from id', async () => {
    const updatedEntity: FileRouteDTO = (
      await request(app.getHttpServer()).put(`/api/file-routes/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE file-routes', async () => {
    const deletedEntity: FileRouteDTO = (await request(app.getHttpServer()).delete(`/api/file-routes/${entityMock.id}`).expect(204)).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
