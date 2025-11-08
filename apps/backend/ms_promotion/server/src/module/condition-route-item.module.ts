import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConditionRouteItem } from '../domain/condition-route-item.entity';
import { ConditionRouteItemController } from '../web/rest/condition-route-item.controller';
import { ConditionRouteItemService } from '../service/condition-route-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConditionRouteItem])],
  controllers: [ConditionRouteItemController],
  providers: [ConditionRouteItemService],
  exports: [ConditionRouteItemService],
})
export class ConditionRouteItemModule {}
