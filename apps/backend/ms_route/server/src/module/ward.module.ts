import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ward } from '../domain/ward.entity';
import { WardController } from '../web/rest/ward.controller';
import { WardService } from '../service/ward.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ward])],
  controllers: [WardController],
  providers: [WardService],
  exports: [WardService],
})
export class WardModule {}
