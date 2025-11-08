import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { SeatMapDTO } from '../src/service/dto/seat-map.dto';
import { SeatMapService } from '../src/service/seat-map.service';

describe('SeatMap Controller', () => {
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
      .overrideProvider(SeatMapService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all seat-maps ', async () => {
    const getEntities: SeatMapDTO[] = (await request(app.getHttpServer()).get('/api/seat-maps').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET seat-maps by id', async () => {
    const getEntity: SeatMapDTO = (await request(app.getHttpServer()).get(`/api/seat-maps/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create seat-maps', async () => {
    const createdEntity: SeatMapDTO = (await request(app.getHttpServer()).post('/api/seat-maps').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update seat-maps', async () => {
    const updatedEntity: SeatMapDTO = (await request(app.getHttpServer()).put('/api/seat-maps').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update seat-maps from id', async () => {
    const updatedEntity: SeatMapDTO = (
      await request(app.getHttpServer()).put(`/api/seat-maps/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE seat-maps', async () => {
    const deletedEntity: SeatMapDTO = (await request(app.getHttpServer()).delete(`/api/seat-maps/${entityMock.id}`).expect(204)).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
