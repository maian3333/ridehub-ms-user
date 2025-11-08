import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { DriverDTO } from '../src/service/dto/driver.dto';
import { DriverService } from '../src/service/driver.service';

describe('Driver Controller', () => {
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
      .overrideProvider(DriverService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all drivers ', async () => {
    const getEntities: DriverDTO[] = (await request(app.getHttpServer()).get('/api/drivers').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET drivers by id', async () => {
    const getEntity: DriverDTO = (await request(app.getHttpServer()).get(`/api/drivers/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create drivers', async () => {
    const createdEntity: DriverDTO = (await request(app.getHttpServer()).post('/api/drivers').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update drivers', async () => {
    const updatedEntity: DriverDTO = (await request(app.getHttpServer()).put('/api/drivers').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update drivers from id', async () => {
    const updatedEntity: DriverDTO = (await request(app.getHttpServer()).put(`/api/drivers/${entityMock.id}`).send(entityMock).expect(201))
      .body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE drivers', async () => {
    const deletedEntity: DriverDTO = (await request(app.getHttpServer()).delete(`/api/drivers/${entityMock.id}`).expect(204)).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
