import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileRoute } from '../domain/file-route.entity';
import { FileRouteController } from '../web/rest/file-route.controller';
import { FileRouteService } from '../service/file-route.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileRoute])],
  controllers: [FileRouteController],
  providers: [FileRouteService],
  exports: [FileRouteService],
})
export class FileRouteModule {}
