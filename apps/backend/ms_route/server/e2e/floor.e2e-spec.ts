import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { FloorDTO } from '../src/service/dto/floor.dto';
import { FloorService } from '../src/service/floor.service';

describe('Floor Controller', () => {
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
      .overrideProvider(FloorService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all floors ', async () => {
    const getEntities: FloorDTO[] = (await request(app.getHttpServer()).get('/api/floors').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET floors by id', async () => {
    const getEntity: FloorDTO = (await request(app.getHttpServer()).get(`/api/floors/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create floors', async () => {
    const createdEntity: FloorDTO = (await request(app.getHttpServer()).post('/api/floors').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update floors', async () => {
    const updatedEntity: FloorDTO = (await request(app.getHttpServer()).put('/api/floors').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update floors from id', async () => {
    const updatedEntity: FloorDTO = (await request(app.getHttpServer()).put(`/api/floors/${entityMock.id}`).send(entityMock).expect(201))
      .body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE floors', async () => {
    const deletedEntity: FloorDTO = (await request(app.getHttpServer()).delete(`/api/floors/${entityMock.id}`).expect(204)).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
