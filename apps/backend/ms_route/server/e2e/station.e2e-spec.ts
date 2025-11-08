import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { StationDTO } from '../src/service/dto/station.dto';
import { StationService } from '../src/service/station.service';

describe('Station Controller', () => {
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
      .overrideProvider(StationService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all stations ', async () => {
    const getEntities: StationDTO[] = (await request(app.getHttpServer()).get('/api/stations').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET stations by id', async () => {
    const getEntity: StationDTO = (await request(app.getHttpServer()).get(`/api/stations/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create stations', async () => {
    const createdEntity: StationDTO = (await request(app.getHttpServer()).post('/api/stations').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update stations', async () => {
    const updatedEntity: StationDTO = (await request(app.getHttpServer()).put('/api/stations').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update stations from id', async () => {
    const updatedEntity: StationDTO = (
      await request(app.getHttpServer()).put(`/api/stations/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE stations', async () => {
    const deletedEntity: StationDTO = (await request(app.getHttpServer()).delete(`/api/stations/${entityMock.id}`).expect(204)).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
