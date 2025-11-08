import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTransaction } from '../domain/payment-transaction.entity';
import { PaymentTransactionController } from '../web/rest/payment-transaction.controller';
import { PaymentTransactionService } from '../service/payment-transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentTransaction])],
  controllers: [PaymentTransactionController],
  providers: [PaymentTransactionService],
  exports: [PaymentTransactionService],
})
export class PaymentTransactionModule {}
