import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PercentOffTotal } from '../domain/percent-off-total.entity';
import { PercentOffTotalController } from '../web/rest/percent-off-total.controller';
import { PercentOffTotalService } from '../service/percent-off-total.service';

@Module({
  imports: [TypeOrmModule.forFeature([PercentOffTotal])],
  controllers: [PercentOffTotalController],
  providers: [PercentOffTotalService],
  exports: [PercentOffTotalService],
})
export class PercentOffTotalModule {}
