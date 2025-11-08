import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppliedPromotion } from '../domain/applied-promotion.entity';
import { AppliedPromotionController } from '../web/rest/applied-promotion.controller';
import { AppliedPromotionService } from '../service/applied-promotion.service';

@Module({
  imports: [TypeOrmModule.forFeature([AppliedPromotion])],
  controllers: [AppliedPromotionController],
  providers: [AppliedPromotionService],
  exports: [AppliedPromotionService],
})
export class AppliedPromotionModule {}
