import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleTimeSlot } from '../domain/schedule-time-slot.entity';
import { ScheduleTimeSlotController } from '../web/rest/schedule-time-slot.controller';
import { ScheduleTimeSlotService } from '../service/schedule-time-slot.service';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleTimeSlot])],
  controllers: [ScheduleTimeSlotController],
  providers: [ScheduleTimeSlotService],
  exports: [ScheduleTimeSlotService],
})
export class ScheduleTimeSlotModule {}
