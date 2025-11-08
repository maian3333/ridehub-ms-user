import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConditionByDate } from '../domain/condition-by-date.entity';
import { ConditionByDateController } from '../web/rest/condition-by-date.controller';
import { ConditionByDateService } from '../service/condition-by-date.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConditionByDate])],
  controllers: [ConditionByDateController],
  providers: [ConditionByDateService],
  exports: [ConditionByDateService],
})
export class ConditionByDateModule {}
