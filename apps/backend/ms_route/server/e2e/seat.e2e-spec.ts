import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { SeatDTO } from '../src/service/dto/seat.dto';
import { SeatService } from '../src/service/seat.service';

describe('Seat Controller', () => {
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
      .overrideProvider(SeatService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all seats ', async () => {
    const getEntities: SeatDTO[] = (await request(app.getHttpServer()).get('/api/seats').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET seats by id', async () => {
    const getEntity: SeatDTO = (await request(app.getHttpServer()).get(`/api/seats/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create seats', async () => {
    const createdEntity: SeatDTO = (await request(app.getHttpServer()).post('/api/seats').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update seats', async () => {
    const updatedEntity: SeatDTO = (await request(app.getHttpServer()).put('/api/seats').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update seats from id', async () => {
    const updatedEntity: SeatDTO = (await request(app.getHttpServer()).put(`/api/seats/${entityMock.id}`).send(entityMock).expect(201))
      .body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE seats', async () => {
    const deletedEntity: SeatDTO = (await request(app.getHttpServer()).delete(`/api/seats/${entityMock.id}`).expect(204)).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
