import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SeedUsersRoles1570200490072 } from './migrations/1570200490072-SeedUsersRoles';
import { CreateTables1570200270081 } from './migrations/1570200270081-CreateTables';
import { User } from './domain/user.entity';
import { Authority } from './domain/authority.entity';
import { Province } from './domain/province.entity';
import { District } from './domain/district.entity';
import { Ward } from './domain/ward.entity';
import { Address } from './domain/address.entity';
import { Station } from './domain/station.entity';
import { Route } from './domain/route.entity';
import { Vehicle } from './domain/vehicle.entity';
import { SeatMap } from './domain/seat-map.entity';
import { Floor } from './domain/floor.entity';
import { Seat } from './domain/seat.entity';
import { Schedule } from './domain/schedule.entity';
import { ScheduleTimeSlot } from './domain/schedule-time-slot.entity';
import { ScheduleOccasion } from './domain/schedule-occasion.entity';
import { Trip } from './domain/trip.entity';
import { Staff } from './domain/staff.entity';
import { Driver } from './domain/driver.entity';
import { Attendant } from './domain/attendant.entity';
import { SeatLock } from './domain/seat-lock.entity';
import { FileRoute } from './domain/file-route.entity';
// jhipster-needle-add-entity-to-ormconfig-imports - JHipster will add code here, do not remove

function ormConfig(): TypeOrmModuleOptions {
  let ormconfig: TypeOrmModuleOptions;

  if (process.env.BACKEND_ENV === 'prod') {
    ormconfig = {
      name: 'default',
      type: 'mysql',
      // typeorm fails to auto load driver due to workspaces resolution
      driver: require('mysql2'),
      database: 'ms_route',
      host: 'mysql',
      // port: ,
      username: 'root',
      password: '',
      logging: false,
      // synchronize: false,
    };
  } else if (process.env.BACKEND_ENV === 'test') {
    ormconfig = {
      name: 'default',
      type: 'sqlite',
      // typeorm fails to auto load driver due to workspaces resolution
      driver: require('sqlite3'),
      database: ':memory:',
      logging: true,
    };
  } else if (process.env.BACKEND_ENV === 'dev') {
    ormconfig = {
      name: 'default',
      type: 'mysql',
      // typeorm fails to auto load driver due to workspaces resolution
      driver: require('sqlite3'),
      database: 'ms_route',
      host: '127.0.0.1',
      // port: ,
      username: 'root',
      password: '',
      logging: false,
    };
  } else {
    ormconfig = {
      name: 'default',
      type: 'sqlite',
      // typeorm fails to auto load driver due to workspaces resolution
      driver: require('sqlite3'),
      database: `${__dirname}../../target/db/sqlite-dev-db.sql`,
      logging: true,
    };
  }

  return {
    synchronize: process.env.BACKEND_ENV === 'test',
    migrationsRun: true,
    entities: [
      User,
      Authority,
      Province,
      District,
      Ward,
      Address,
      Station,
      Route,
      Vehicle,
      SeatMap,
      Floor,
      Seat,
      Schedule,
      ScheduleTimeSlot,
      ScheduleOccasion,
      Trip,
      Staff,
      Driver,
      Attendant,
      SeatLock,
      FileRoute,
      // jhipster-needle-add-entity-to-ormconfig-entities - JHipster will add code here, do not remove
    ],
    migrations: [
      CreateTables1570200270081,
      SeedUsersRoles1570200490072,
      // jhipster-needle-add-migration-to-ormconfig-migrations - JHipster will add code here, do not remove
    ],
    autoLoadEntities: true,
    ...ormconfig,
  };
}

export { ormConfig };
