import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileBooking } from '../domain/file-booking.entity';
import { FileBookingController } from '../web/rest/file-booking.controller';
import { FileBookingService } from '../service/file-booking.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileBooking])],
  controllers: [FileBookingController],
  providers: [FileBookingService],
  exports: [FileBookingService],
})
export class FileBookingModule {}
