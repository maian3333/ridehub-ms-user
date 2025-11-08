import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentWebhookLog } from '../domain/payment-webhook-log.entity';
import { PaymentWebhookLogController } from '../web/rest/payment-webhook-log.controller';
import { PaymentWebhookLogService } from '../service/payment-webhook-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentWebhookLog])],
  controllers: [PaymentWebhookLogController],
  providers: [PaymentWebhookLogService],
  exports: [PaymentWebhookLogService],
})
export class PaymentWebhookLogModule {}
