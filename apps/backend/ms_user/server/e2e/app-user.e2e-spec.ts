import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { AppUserDTO } from '../src/service/dto/app-user.dto';
import { AppUserService } from '../src/service/app-user.service';

describe('AppUser Controller', () => {
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
      .overrideProvider(AppUserService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all app-users ', async () => {
    const getEntities: AppUserDTO[] = (await request(app.getHttpServer()).get('/api/app-users').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET app-users by id', async () => {
    const getEntity: AppUserDTO = (await request(app.getHttpServer()).get(`/api/app-users/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create app-users', async () => {
    const createdEntity: AppUserDTO = (await request(app.getHttpServer()).post('/api/app-users').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update app-users', async () => {
    const updatedEntity: AppUserDTO = (await request(app.getHttpServer()).put('/api/app-users').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update app-users from id', async () => {
    const updatedEntity: AppUserDTO = (
      await request(app.getHttpServer()).put(`/api/app-users/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE app-users', async () => {
    const deletedEntity: AppUserDTO = (await request(app.getHttpServer()).delete(`/api/app-users/${entityMock.id}`).expect(204)).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
