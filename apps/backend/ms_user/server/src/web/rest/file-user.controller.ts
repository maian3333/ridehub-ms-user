import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post as PostMethod,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FileUserDTO } from '../../service/dto/file-user.dto';
import { FileUserService } from '../../service/file-user.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/file-users')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('file-users')
export class FileUserController {
  logger = new Logger('FileUserController');

  constructor(private readonly fileUserService: FileUserService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: FileUserDTO,
  })
  async getAll(@Req() req: Request): Promise<FileUserDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.fileUserService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: FileUserDTO,
  })
  async getOne(@Param('id') id: number): Promise<FileUserDTO> {
    return await this.fileUserService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create fileUser' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: FileUserDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() fileUserDTO: FileUserDTO): Promise<FileUserDTO> {
    const created = await this.fileUserService.save(fileUserDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'FileUser', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update fileUser' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: FileUserDTO,
  })
  async put(@Req() req: Request, @Body() fileUserDTO: FileUserDTO): Promise<FileUserDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'FileUser', fileUserDTO.id);
    return await this.fileUserService.update(fileUserDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update fileUser with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: FileUserDTO,
  })
  async putId(@Req() req: Request, @Body() fileUserDTO: FileUserDTO): Promise<FileUserDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'FileUser', fileUserDTO.id);
    return await this.fileUserService.update(fileUserDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete fileUser' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'FileUser', id);
    return await this.fileUserService.deleteById(id);
  }
}
