import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilePromotion } from '../domain/file-promotion.entity';
import { FilePromotionController } from '../web/rest/file-promotion.controller';
import { FilePromotionService } from '../service/file-promotion.service';

@Module({
  imports: [TypeOrmModule.forFeature([FilePromotion])],
  controllers: [FilePromotionController],
  providers: [FilePromotionService],
  exports: [FilePromotionService],
})
export class FilePromotionModule {}
