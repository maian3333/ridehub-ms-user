import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleOccasion } from '../domain/schedule-occasion.entity';
import { ScheduleOccasionController } from '../web/rest/schedule-occasion.controller';
import { ScheduleOccasionService } from '../service/schedule-occasion.service';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleOccasion])],
  controllers: [ScheduleOccasionController],
  providers: [ScheduleOccasionService],
  exports: [ScheduleOccasionService],
})
export class ScheduleOccasionModule {}
