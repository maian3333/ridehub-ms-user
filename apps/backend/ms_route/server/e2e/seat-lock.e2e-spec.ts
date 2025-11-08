import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { SeatLockDTO } from '../src/service/dto/seat-lock.dto';
import { SeatLockService } from '../src/service/seat-lock.service';

describe('SeatLock Controller', () => {
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
      .overrideProvider(SeatLockService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all seat-locks ', async () => {
    const getEntities: SeatLockDTO[] = (await request(app.getHttpServer()).get('/api/seat-locks').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET seat-locks by id', async () => {
    const getEntity: SeatLockDTO = (await request(app.getHttpServer()).get(`/api/seat-locks/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create seat-locks', async () => {
    const createdEntity: SeatLockDTO = (await request(app.getHttpServer()).post('/api/seat-locks').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update seat-locks', async () => {
    const updatedEntity: SeatLockDTO = (await request(app.getHttpServer()).put('/api/seat-locks').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update seat-locks from id', async () => {
    const updatedEntity: SeatLockDTO = (
      await request(app.getHttpServer()).put(`/api/seat-locks/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE seat-locks', async () => {
    const deletedEntity: SeatLockDTO = (await request(app.getHttpServer()).delete(`/api/seat-locks/${entityMock.id}`).expect(204)).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
