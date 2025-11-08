import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConditionDateItem } from '../domain/condition-date-item.entity';
import { ConditionDateItemController } from '../web/rest/condition-date-item.controller';
import { ConditionDateItemService } from '../service/condition-date-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConditionDateItem])],
  controllers: [ConditionDateItemController],
  providers: [ConditionDateItemService],
  exports: [ConditionDateItemService],
})
export class ConditionDateItemModule {}
