import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { PaymentWebhookLogDTO } from '../src/service/dto/payment-webhook-log.dto';
import { PaymentWebhookLogService } from '../src/service/payment-webhook-log.service';

describe('PaymentWebhookLog Controller', () => {
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
      .overrideProvider(PaymentWebhookLogService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all payment-webhook-logs ', async () => {
    const getEntities: PaymentWebhookLogDTO[] = (await request(app.getHttpServer()).get('/api/payment-webhook-logs').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET payment-webhook-logs by id', async () => {
    const getEntity: PaymentWebhookLogDTO = (
      await request(app.getHttpServer()).get(`/api/payment-webhook-logs/${entityMock.id}`).expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create payment-webhook-logs', async () => {
    const createdEntity: PaymentWebhookLogDTO = (
      await request(app.getHttpServer()).post('/api/payment-webhook-logs').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update payment-webhook-logs', async () => {
    const updatedEntity: PaymentWebhookLogDTO = (
      await request(app.getHttpServer()).put('/api/payment-webhook-logs').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update payment-webhook-logs from id', async () => {
    const updatedEntity: PaymentWebhookLogDTO = (
      await request(app.getHttpServer()).put(`/api/payment-webhook-logs/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE payment-webhook-logs', async () => {
    const deletedEntity: PaymentWebhookLogDTO = (
      await request(app.getHttpServer()).delete(`/api/payment-webhook-logs/${entityMock.id}`).expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
