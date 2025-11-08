import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConditionByLocation } from '../domain/condition-by-location.entity';
import { ConditionByLocationController } from '../web/rest/condition-by-location.controller';
import { ConditionByLocationService } from '../service/condition-by-location.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConditionByLocation])],
  controllers: [ConditionByLocationController],
  providers: [ConditionByLocationService],
  exports: [ConditionByLocationService],
})
export class ConditionByLocationModule {}
