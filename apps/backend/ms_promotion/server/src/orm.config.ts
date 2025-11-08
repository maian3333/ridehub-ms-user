import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SeedUsersRoles1570200490072 } from './migrations/1570200490072-SeedUsersRoles';
import { CreateTables1570200270081 } from './migrations/1570200270081-CreateTables';
import { User } from './domain/user.entity';
import { Authority } from './domain/authority.entity';
import { Promotion } from './domain/promotion.entity';
import { BuyNGetMFree } from './domain/buy-n-get-m-free.entity';
import { PercentOffTotal } from './domain/percent-off-total.entity';
import { ConditionByRoute } from './domain/condition-by-route.entity';
import { ConditionByDate } from './domain/condition-by-date.entity';
import { ConditionByLocation } from './domain/condition-by-location.entity';
import { ConditionRouteItem } from './domain/condition-route-item.entity';
import { ConditionDateItem } from './domain/condition-date-item.entity';
import { ConditionLocationItem } from './domain/condition-location-item.entity';
import { FilePromotion } from './domain/file-promotion.entity';
// jhipster-needle-add-entity-to-ormconfig-imports - JHipster will add code here, do not remove

function ormConfig(): TypeOrmModuleOptions {
  let ormconfig: TypeOrmModuleOptions;

  if (process.env.BACKEND_ENV === 'prod') {
    ormconfig = {
      name: 'default',
      type: 'mysql',
      // typeorm fails to auto load driver due to workspaces resolution
      driver: require('mysql2'),
      database: 'ms_promotion',
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
      database: 'ms_promotion',
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
      Promotion,
      BuyNGetMFree,
      PercentOffTotal,
      ConditionByRoute,
      ConditionByDate,
      ConditionByLocation,
      ConditionRouteItem,
      ConditionDateItem,
      ConditionLocationItem,
      FilePromotion,
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
