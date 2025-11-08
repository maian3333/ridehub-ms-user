import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { FileUserDTO } from '../src/service/dto/file-user.dto';
import { FileUserService } from '../src/service/file-user.service';

describe('FileUser Controller', () => {
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
      .overrideProvider(FileUserService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all file-users ', async () => {
    const getEntities: FileUserDTO[] = (await request(app.getHttpServer()).get('/api/file-users').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET file-users by id', async () => {
    const getEntity: FileUserDTO = (await request(app.getHttpServer()).get(`/api/file-users/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create file-users', async () => {
    const createdEntity: FileUserDTO = (await request(app.getHttpServer()).post('/api/file-users').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update file-users', async () => {
    const updatedEntity: FileUserDTO = (await request(app.getHttpServer()).put('/api/file-users').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update file-users from id', async () => {
    const updatedEntity: FileUserDTO = (
      await request(app.getHttpServer()).put(`/api/file-users/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE file-users', async () => {
    const deletedEntity: FileUserDTO = (await request(app.getHttpServer()).delete(`/api/file-users/${entityMock.id}`).expect(204)).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
