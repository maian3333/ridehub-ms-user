import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { BookingDTO } from '../src/service/dto/booking.dto';
import { BookingService } from '../src/service/booking.service';

describe('Booking Controller', () => {
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
      .overrideProvider(BookingService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all bookings ', async () => {
    const getEntities: BookingDTO[] = (await request(app.getHttpServer()).get('/api/bookings').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET bookings by id', async () => {
    const getEntity: BookingDTO = (await request(app.getHttpServer()).get(`/api/bookings/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create bookings', async () => {
    const createdEntity: BookingDTO = (await request(app.getHttpServer()).post('/api/bookings').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update bookings', async () => {
    const updatedEntity: BookingDTO = (await request(app.getHttpServer()).put('/api/bookings').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update bookings from id', async () => {
    const updatedEntity: BookingDTO = (
      await request(app.getHttpServer()).put(`/api/bookings/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE bookings', async () => {
    const deletedEntity: BookingDTO = (await request(app.getHttpServer()).delete(`/api/bookings/${entityMock.id}`).expect(204)).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
