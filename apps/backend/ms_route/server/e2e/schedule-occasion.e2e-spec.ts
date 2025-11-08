import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { ScheduleOccasionDTO } from '../src/service/dto/schedule-occasion.dto';
import { ScheduleOccasionService } from '../src/service/schedule-occasion.service';

describe('ScheduleOccasion Controller', () => {
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
      .overrideProvider(ScheduleOccasionService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all schedule-occasions ', async () => {
    const getEntities: ScheduleOccasionDTO[] = (await request(app.getHttpServer()).get('/api/schedule-occasions').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET schedule-occasions by id', async () => {
    const getEntity: ScheduleOccasionDTO = (await request(app.getHttpServer()).get(`/api/schedule-occasions/${entityMock.id}`).expect(200))
      .body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create schedule-occasions', async () => {
    const createdEntity: ScheduleOccasionDTO = (
      await request(app.getHttpServer()).post('/api/schedule-occasions').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update schedule-occasions', async () => {
    const updatedEntity: ScheduleOccasionDTO = (
      await request(app.getHttpServer()).put('/api/schedule-occasions').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update schedule-occasions from id', async () => {
    const updatedEntity: ScheduleOccasionDTO = (
      await request(app.getHttpServer()).put(`/api/schedule-occasions/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE schedule-occasions', async () => {
    const deletedEntity: ScheduleOccasionDTO = (
      await request(app.getHttpServer()).delete(`/api/schedule-occasions/${entityMock.id}`).expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
