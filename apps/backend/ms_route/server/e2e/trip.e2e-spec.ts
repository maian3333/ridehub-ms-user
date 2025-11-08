import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { TripDTO } from '../src/service/dto/trip.dto';
import { TripService } from '../src/service/trip.service';

describe('Trip Controller', () => {
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
      .overrideProvider(TripService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all trips ', async () => {
    const getEntities: TripDTO[] = (await request(app.getHttpServer()).get('/api/trips').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET trips by id', async () => {
    const getEntity: TripDTO = (await request(app.getHttpServer()).get(`/api/trips/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create trips', async () => {
    const createdEntity: TripDTO = (await request(app.getHttpServer()).post('/api/trips').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update trips', async () => {
    const updatedEntity: TripDTO = (await request(app.getHttpServer()).put('/api/trips').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update trips from id', async () => {
    const updatedEntity: TripDTO = (await request(app.getHttpServer()).put(`/api/trips/${entityMock.id}`).send(entityMock).expect(201))
      .body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE trips', async () => {
    const deletedEntity: TripDTO = (await request(app.getHttpServer()).delete(`/api/trips/${entityMock.id}`).expect(204)).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
