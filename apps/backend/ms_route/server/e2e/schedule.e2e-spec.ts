import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { ScheduleDTO } from '../src/service/dto/schedule.dto';
import { ScheduleService } from '../src/service/schedule.service';

describe('Schedule Controller', () => {
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
      .overrideProvider(ScheduleService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all schedules ', async () => {
    const getEntities: ScheduleDTO[] = (await request(app.getHttpServer()).get('/api/schedules').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET schedules by id', async () => {
    const getEntity: ScheduleDTO = (await request(app.getHttpServer()).get(`/api/schedules/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create schedules', async () => {
    const createdEntity: ScheduleDTO = (await request(app.getHttpServer()).post('/api/schedules').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update schedules', async () => {
    const updatedEntity: ScheduleDTO = (await request(app.getHttpServer()).put('/api/schedules').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update schedules from id', async () => {
    const updatedEntity: ScheduleDTO = (
      await request(app.getHttpServer()).put(`/api/schedules/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE schedules', async () => {
    const deletedEntity: ScheduleDTO = (await request(app.getHttpServer()).delete(`/api/schedules/${entityMock.id}`).expect(204)).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
