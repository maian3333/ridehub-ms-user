import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatMap } from '../domain/seat-map.entity';
import { SeatMapController } from '../web/rest/seat-map.controller';
import { SeatMapService } from '../service/seat-map.service';

@Module({
  imports: [TypeOrmModule.forFeature([SeatMap])],
  controllers: [SeatMapController],
  providers: [SeatMapService],
  exports: [SeatMapService],
})
export class SeatMapModule {}
