import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyNGetMFree } from '../domain/buy-n-get-m-free.entity';
import { BuyNGetMFreeController } from '../web/rest/buy-n-get-m-free.controller';
import { BuyNGetMFreeService } from '../service/buy-n-get-m-free.service';

@Module({
  imports: [TypeOrmModule.forFeature([BuyNGetMFree])],
  controllers: [BuyNGetMFreeController],
  providers: [BuyNGetMFreeService],
  exports: [BuyNGetMFreeService],
})
export class BuyNGetMFreeModule {}
