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
import { RouteDTO } from '../../service/dto/route.dto';
import { RouteService } from '../../service/route.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/routes')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('routes')
export class RouteController {
  logger = new Logger('RouteController');

  constructor(private readonly routeService: RouteService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: RouteDTO,
  })
  async getAll(@Req() req: Request): Promise<RouteDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.routeService.findAndCount({
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
    type: RouteDTO,
  })
  async getOne(@Param('id') id: number): Promise<RouteDTO> {
    return await this.routeService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create route' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: RouteDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() routeDTO: RouteDTO): Promise<RouteDTO> {
    const created = await this.routeService.save(routeDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Route', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update route' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: RouteDTO,
  })
  async put(@Req() req: Request, @Body() routeDTO: RouteDTO): Promise<RouteDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Route', routeDTO.id);
    return await this.routeService.update(routeDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update route with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: RouteDTO,
  })
  async putId(@Req() req: Request, @Body() routeDTO: RouteDTO): Promise<RouteDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Route', routeDTO.id);
    return await this.routeService.update(routeDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete route' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Route', id);
    return await this.routeService.deleteById(id);
  }
}
