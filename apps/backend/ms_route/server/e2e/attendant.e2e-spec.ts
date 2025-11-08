import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { AttendantDTO } from '../src/service/dto/attendant.dto';
import { AttendantService } from '../src/service/attendant.service';

describe('Attendant Controller', () => {
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
      .overrideProvider(AttendantService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all attendants ', async () => {
    const getEntities: AttendantDTO[] = (await request(app.getHttpServer()).get('/api/attendants').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET attendants by id', async () => {
    const getEntity: AttendantDTO = (await request(app.getHttpServer()).get(`/api/attendants/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create attendants', async () => {
    const createdEntity: AttendantDTO = (await request(app.getHttpServer()).post('/api/attendants').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update attendants', async () => {
    const updatedEntity: AttendantDTO = (await request(app.getHttpServer()).put('/api/attendants').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update attendants from id', async () => {
    const updatedEntity: AttendantDTO = (
      await request(app.getHttpServer()).put(`/api/attendants/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE attendants', async () => {
    const deletedEntity: AttendantDTO = (await request(app.getHttpServer()).delete(`/api/attendants/${entityMock.id}`).expect(204)).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
