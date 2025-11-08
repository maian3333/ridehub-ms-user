import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUser } from '../domain/file-user.entity';
import { FileUserController } from '../web/rest/file-user.controller';
import { FileUserService } from '../service/file-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileUser])],
  controllers: [FileUserController],
  providers: [FileUserService],
  exports: [FileUserService],
})
export class FileUserModule {}
