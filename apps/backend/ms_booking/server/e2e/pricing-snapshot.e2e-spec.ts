import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { PricingSnapshotDTO } from '../src/service/dto/pricing-snapshot.dto';
import { PricingSnapshotService } from '../src/service/pricing-snapshot.service';

describe('PricingSnapshot Controller', () => {
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
      .overrideProvider(PricingSnapshotService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all pricing-snapshots ', async () => {
    const getEntities: PricingSnapshotDTO[] = (await request(app.getHttpServer()).get('/api/pricing-snapshots').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET pricing-snapshots by id', async () => {
    const getEntity: PricingSnapshotDTO = (await request(app.getHttpServer()).get(`/api/pricing-snapshots/${entityMock.id}`).expect(200))
      .body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create pricing-snapshots', async () => {
    const createdEntity: PricingSnapshotDTO = (
      await request(app.getHttpServer()).post('/api/pricing-snapshots').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update pricing-snapshots', async () => {
    const updatedEntity: PricingSnapshotDTO = (
      await request(app.getHttpServer()).put('/api/pricing-snapshots').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update pricing-snapshots from id', async () => {
    const updatedEntity: PricingSnapshotDTO = (
      await request(app.getHttpServer()).put(`/api/pricing-snapshots/${entityMock.id}`).send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE pricing-snapshots', async () => {
    const deletedEntity: PricingSnapshotDTO = (
      await request(app.getHttpServer()).delete(`/api/pricing-snapshots/${entityMock.id}`).expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app?.close();
  });
});
