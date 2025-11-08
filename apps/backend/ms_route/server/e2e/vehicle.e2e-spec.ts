import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { VehicleDTO } from '../src/service/dto/vehicle.dto';
import { VehicleService } from '../src/service/vehicle.service';

describe('Vehicle Controller', () => {
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
      .overrideProvider(VehicleService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all vehicles ', async () => {
    const getEntities: VehicleDTO[] = (await request(app.getHttpServer()).get('/api/vehicles').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET vehicles by id', async () => {
    const getEntity: VehicleDTO = (await request(app.getHttpServer()).get(`/api/vehicles/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create vehicles', async () => {
    const createdEntity: VehicleDTO = (await request(app.getHttpServer()).post('/api/vehicles').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update vehicles', async () => {
    const updatedEntity: VehicleDTO = (await request(app.getHttpServer()).put('/api/vehicles').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update vehicles from id', async () => {
    const updatedEntity: VehicleDTO = (
      await request(app.getHttpServer()).put(`/api/vehicles/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE vehicles', async () => {
    const deletedEntity: VehicleDTO = (await request(app.getHttpServer()).delete(`/api/vehicles/${entityMock.id}`).expect(204)).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
