import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatLock } from '../domain/seat-lock.entity';
import { SeatLockController } from '../web/rest/seat-lock.controller';
import { SeatLockService } from '../service/seat-lock.service';

@Module({
  imports: [TypeOrmModule.forFeature([SeatLock])],
  controllers: [SeatLockController],
  providers: [SeatLockService],
  exports: [SeatLockService],
})
export class SeatLockModule {}
