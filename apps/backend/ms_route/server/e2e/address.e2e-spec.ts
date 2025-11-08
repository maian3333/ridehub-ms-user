import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { AddressDTO } from '../src/service/dto/address.dto';
import { AddressService } from '../src/service/address.service';

describe('Address Controller', () => {
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
      .overrideProvider(AddressService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all addresses ', async () => {
    const getEntities: AddressDTO[] = (await request(app.getHttpServer()).get('/api/addresses').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET addresses by id', async () => {
    const getEntity: AddressDTO = (await request(app.getHttpServer()).get(`/api/addresses/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create addresses', async () => {
    const createdEntity: AddressDTO = (await request(app.getHttpServer()).post('/api/addresses').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update addresses', async () => {
    const updatedEntity: AddressDTO = (await request(app.getHttpServer()).put('/api/addresses').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update addresses from id', async () => {
    const updatedEntity: AddressDTO = (
      await request(app.getHttpServer()).put(`/api/addresses/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE addresses', async () => {
    const deletedEntity: AddressDTO = (await request(app.getHttpServer()).delete(`/api/addresses/${entityMock.id}`).expect(204)).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
