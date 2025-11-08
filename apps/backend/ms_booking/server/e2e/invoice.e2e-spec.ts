import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { InvoiceDTO } from '../src/service/dto/invoice.dto';
import { InvoiceService } from '../src/service/invoice.service';

describe('Invoice Controller', () => {
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
      .overrideProvider(InvoiceService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all invoices ', async () => {
    const getEntities: InvoiceDTO[] = (await request(app.getHttpServer()).get('/api/invoices').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET invoices by id', async () => {
    const getEntity: InvoiceDTO = (await request(app.getHttpServer()).get(`/api/invoices/${entityMock.id}`).expect(200)).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create invoices', async () => {
    const createdEntity: InvoiceDTO = (await request(app.getHttpServer()).post('/api/invoices').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update invoices', async () => {
    const updatedEntity: InvoiceDTO = (await request(app.getHttpServer()).put('/api/invoices').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update invoices from id', async () => {
    const updatedEntity: InvoiceDTO = (
      await request(app.getHttpServer()).put(`/api/invoices/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE invoices', async () => {
    const deletedEntity: InvoiceDTO = (await request(app.getHttpServer()).delete(`/api/invoices/${entityMock.id}`).expect(204)).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
