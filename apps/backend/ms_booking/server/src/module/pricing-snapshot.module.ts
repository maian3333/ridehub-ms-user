import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingSnapshot } from '../domain/pricing-snapshot.entity';
import { PricingSnapshotController } from '../web/rest/pricing-snapshot.controller';
import { PricingSnapshotService } from '../service/pricing-snapshot.service';

@Module({
  imports: [TypeOrmModule.forFeature([PricingSnapshot])],
  controllers: [PricingSnapshotController],
  providers: [PricingSnapshotService],
  exports: [PricingSnapshotService],
})
export class PricingSnapshotModule {}
