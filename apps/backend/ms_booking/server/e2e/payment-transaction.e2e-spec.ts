import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { PaymentTransactionDTO } from '../src/service/dto/payment-transaction.dto';
import { PaymentTransactionService } from '../src/service/payment-transaction.service';

describe('PaymentTransaction Controller', () => {
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
      .overrideProvider(PaymentTransactionService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all payment-transactions ', async () => {
    const getEntities: PaymentTransactionDTO[] = (await request(app.getHttpServer()).get('/api/payment-transactions').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET payment-transactions by id', async () => {
    const getEntity: PaymentTransactionDTO = (
      await request(app.getHttpServer()).get(`/api/payment-transactions/${entityMock.id}`).expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create payment-transactions', async () => {
    const createdEntity: PaymentTransactionDTO = (
      await request(app.getHttpServer()).post('/api/payment-transactions').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update payment-transactions', async () => {
    const updatedEntity: PaymentTransactionDTO = (
      await request(app.getHttpServer()).put('/api/payment-transactions').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update payment-transactions from id', async () => {
    const updatedEntity: PaymentTransactionDTO = (
      await request(app.getHttpServer()).put(`/api/payment-transactions/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE payment-transactions', async () => {
    const deletedEntity: PaymentTransactionDTO = (
      await request(app.getHttpServer()).delete(`/api/payment-transactions/${entityMock.id}`).expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
