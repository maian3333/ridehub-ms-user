import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConditionByRoute } from '../domain/condition-by-route.entity';
import { ConditionByRouteController } from '../web/rest/condition-by-route.controller';
import { ConditionByRouteService } from '../service/condition-by-route.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConditionByRoute])],
  controllers: [ConditionByRouteController],
  providers: [ConditionByRouteService],
  exports: [ConditionByRouteService],
})
export class ConditionByRouteModule {}
