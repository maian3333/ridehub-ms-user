import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth.module';
import { ormConfig } from './orm.config';
import { BookingModule } from './module/booking.module';
import { TicketModule } from './module/ticket.module';
import { InvoiceModule } from './module/invoice.module';
import { PaymentTransactionModule } from './module/payment-transaction.module';
import { AppliedPromotionModule } from './module/applied-promotion.module';
import { PricingSnapshotModule } from './module/pricing-snapshot.module';
import { PaymentWebhookLogModule } from './module/payment-webhook-log.module';
import { FileBookingModule } from './module/file-booking.module';
// jhipster-needle-add-entity-module-to-main-import - JHipster will import entity modules here, do not remove
// jhipster-needle-add-controller-module-to-main-import - JHipster will import controller modules here, do not remove
// jhipster-needle-add-service-module-to-main-import - JHipster will import service modules here, do not remove

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    AuthModule,
    BookingModule,
    TicketModule,
    InvoiceModule,
    PaymentTransactionModule,
    AppliedPromotionModule,
    PricingSnapshotModule,
    PaymentWebhookLogModule,
    FileBookingModule,
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
