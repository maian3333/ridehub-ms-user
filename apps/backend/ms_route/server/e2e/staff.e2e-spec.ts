import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { StaffDTO } from '../src/service/dto/staff.dto';
import { StaffService } from '../src/service/staff.service';

describe('Staff Controller', () => {
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
      .overrideProvider(StaffService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all staff ', async () => {
    const getEntities: StaffDTO[] = (await request(app.getHttpServer()).get('/api/staff').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET staff by id', async () => {
    const getEntity: StaffDTO = (await request(app.getHttpServer()).get(`/api/staff/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create staff', async () => {
    const createdEntity: StaffDTO = (await request(app.getHttpServer()).post('/api/staff').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update staff', async () => {
    const updatedEntity: StaffDTO = (await request(app.getHttpServer()).put('/api/staff').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update staff from id', async () => {
    const updatedEntity: StaffDTO = (await request(app.getHttpServer()).put(`/api/staff/${entityMock.id}`).send(entityMock).expect(201))
      .body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE staff', async () => {
    const deletedEntity: StaffDTO = (await request(app.getHttpServer()).delete(`/api/staff/${entityMock.id}`).expect(204)).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
