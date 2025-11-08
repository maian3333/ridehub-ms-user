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
import { FileRouteDTO } from '../../service/dto/file-route.dto';
import { FileRouteService } from '../../service/file-route.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/file-routes')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('file-routes')
export class FileRouteController {
  logger = new Logger('FileRouteController');

  constructor(private readonly fileRouteService: FileRouteService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: FileRouteDTO,
  })
  async getAll(@Req() req: Request): Promise<FileRouteDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.fileRouteService.findAndCount({
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
    type: FileRouteDTO,
  })
  async getOne(@Param('id') id: number): Promise<FileRouteDTO> {
    return await this.fileRouteService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create fileRoute' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: FileRouteDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() fileRouteDTO: FileRouteDTO): Promise<FileRouteDTO> {
    const created = await this.fileRouteService.save(fileRouteDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'FileRoute', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update fileRoute' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: FileRouteDTO,
  })
  async put(@Req() req: Request, @Body() fileRouteDTO: FileRouteDTO): Promise<FileRouteDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'FileRoute', fileRouteDTO.id);
    return await this.fileRouteService.update(fileRouteDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update fileRoute with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: FileRouteDTO,
  })
  async putId(@Req() req: Request, @Body() fileRouteDTO: FileRouteDTO): Promise<FileRouteDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'FileRoute', fileRouteDTO.id);
    return await this.fileRouteService.update(fileRouteDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete fileRoute' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'FileRoute', id);
    return await this.fileRouteService.deleteById(id);
  }
}
