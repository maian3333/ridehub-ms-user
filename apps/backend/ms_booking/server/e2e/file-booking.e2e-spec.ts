import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { FileBookingDTO } from '../src/service/dto/file-booking.dto';
import { FileBookingService } from '../src/service/file-booking.service';

describe('FileBooking Controller', () => {
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
      .overrideProvider(FileBookingService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all file-bookings ', async () => {
    const getEntities: FileBookingDTO[] = (await request(app.getHttpServer()).get('/api/file-bookings').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET file-bookings by id', async () => {
    const getEntity: FileBookingDTO = (await request(app.getHttpServer()).get(`/api/file-bookings/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create file-bookings', async () => {
    const createdEntity: FileBookingDTO = (await request(app.getHttpServer()).post('/api/file-bookings').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update file-bookings', async () => {
    const updatedEntity: FileBookingDTO = (await request(app.getHttpServer()).put('/api/file-bookings').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update file-bookings from id', async () => {
    const updatedEntity: FileBookingDTO = (
      await request(app.getHttpServer()).put(`/api/file-bookings/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE file-bookings', async () => {
    const deletedEntity: FileBookingDTO = (await request(app.getHttpServer()).delete(`/api/file-bookings/${entityMock.id}`).expect(204))
      .body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
