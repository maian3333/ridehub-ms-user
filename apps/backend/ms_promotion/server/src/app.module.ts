import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth.module';
import { ormConfig } from './orm.config';
import { PromotionModule } from './module/promotion.module';
import { BuyNGetMFreeModule } from './module/buy-n-get-m-free.module';
import { PercentOffTotalModule } from './module/percent-off-total.module';
import { ConditionByRouteModule } from './module/condition-by-route.module';
import { ConditionByDateModule } from './module/condition-by-date.module';
import { ConditionByLocationModule } from './module/condition-by-location.module';
import { ConditionRouteItemModule } from './module/condition-route-item.module';
import { ConditionDateItemModule } from './module/condition-date-item.module';
import { ConditionLocationItemModule } from './module/condition-location-item.module';
import { FilePromotionModule } from './module/file-promotion.module';
// jhipster-needle-add-entity-module-to-main-import - JHipster will import entity modules here, do not remove
// jhipster-needle-add-controller-module-to-main-import - JHipster will import controller modules here, do not remove
// jhipster-needle-add-service-module-to-main-import - JHipster will import service modules here, do not remove

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    AuthModule,
    PromotionModule,
    BuyNGetMFreeModule,
    PercentOffTotalModule,
    ConditionByRouteModule,
    ConditionByDateModule,
    ConditionByLocationModule,
    ConditionRouteItemModule,
    ConditionDateItemModule,
    ConditionLocationItemModule,
    FilePromotionModule,
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
