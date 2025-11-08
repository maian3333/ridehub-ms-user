import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth.module';
import { ormConfig } from './orm.config';
import { ProvinceModule } from './module/province.module';
import { DistrictModule } from './module/district.module';
import { WardModule } from './module/ward.module';
import { AddressModule } from './module/address.module';
import { StationModule } from './module/station.module';
import { RouteModule } from './module/route.module';
import { VehicleModule } from './module/vehicle.module';
import { SeatMapModule } from './module/seat-map.module';
import { FloorModule } from './module/floor.module';
import { SeatModule } from './module/seat.module';
import { ScheduleModule } from './module/schedule.module';
import { ScheduleTimeSlotModule } from './module/schedule-time-slot.module';
import { ScheduleOccasionModule } from './module/schedule-occasion.module';
import { TripModule } from './module/trip.module';
import { StaffModule } from './module/staff.module';
import { DriverModule } from './module/driver.module';
import { AttendantModule } from './module/attendant.module';
import { SeatLockModule } from './module/seat-lock.module';
import { FileRouteModule } from './module/file-route.module';
// jhipster-needle-add-entity-module-to-main-import - JHipster will import entity modules here, do not remove
// jhipster-needle-add-controller-module-to-main-import - JHipster will import controller modules here, do not remove
// jhipster-needle-add-service-module-to-main-import - JHipster will import service modules here, do not remove

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    AuthModule,
    ProvinceModule,
    DistrictModule,
    WardModule,
    AddressModule,
    StationModule,
    RouteModule,
    VehicleModule,
    SeatMapModule,
    FloorModule,
    SeatModule,
    ScheduleModule,
    ScheduleTimeSlotModule,
    ScheduleOccasionModule,
    TripModule,
    StaffModule,
    DriverModule,
    AttendantModule,
    SeatLockModule,
    FileRouteModule,
    // jhipster-needle-add-entity-module-to-main - JHipster will add entity modules here, do not remove
  ],
  controllers: [
    // jhipster-needle-add-controller-module-to-main - JHipster will add controller modules here, do not remove
  ],
  providers: [
    // jhipster-needle-add-service-module-to-main - JHipster will add service modules here, do not remove
  ],
})
export class AppModule {}
