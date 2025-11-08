import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConditionLocationItem } from '../domain/condition-location-item.entity';
import { ConditionLocationItemController } from '../web/rest/condition-location-item.controller';
import { ConditionLocationItemService } from '../service/condition-location-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConditionLocationItem])],
  controllers: [ConditionLocationItemController],
  providers: [ConditionLocationItemService],
  exports: [ConditionLocationItemService],
})
export class ConditionLocationItemModule {}
