import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendant } from '../domain/attendant.entity';
import { AttendantController } from '../web/rest/attendant.controller';
import { AttendantService } from '../service/attendant.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attendant])],
  controllers: [AttendantController],
  providers: [AttendantService],
  exports: [AttendantService],
})
export class AttendantModule {}
