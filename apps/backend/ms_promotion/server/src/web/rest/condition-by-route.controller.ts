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
import { ConditionByRouteDTO } from '../../service/dto/condition-by-route.dto';
import { ConditionByRouteService } from '../../service/condition-by-route.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/condition-by-routes')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('condition-by-routes')
export class ConditionByRouteController {
  logger = new Logger('ConditionByRouteController');

  constructor(private readonly conditionByRouteService: ConditionByRouteService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ConditionByRouteDTO,
  })
  async getAll(@Req() req: Request): Promise<ConditionByRouteDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.conditionByRouteService.findAndCount({
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
    type: ConditionByRouteDTO,
  })
  async getOne(@Param('id') id: number): Promise<ConditionByRouteDTO> {
    return await this.conditionByRouteService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create conditionByRoute' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ConditionByRouteDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() conditionByRouteDTO: ConditionByRouteDTO): Promise<ConditionByRouteDTO> {
    const created = await this.conditionByRouteService.save(conditionByRouteDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ConditionByRoute', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update conditionByRoute' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ConditionByRouteDTO,
  })
  async put(@Req() req: Request, @Body() conditionByRouteDTO: ConditionByRouteDTO): Promise<ConditionByRouteDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ConditionByRoute', conditionByRouteDTO.id);
    return await this.conditionByRouteService.update(conditionByRouteDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update conditionByRoute with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ConditionByRouteDTO,
  })
  async putId(@Req() req: Request, @Body() conditionByRouteDTO: ConditionByRouteDTO): Promise<ConditionByRouteDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ConditionByRoute', conditionByRouteDTO.id);
    return await this.conditionByRouteService.update(conditionByRouteDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete conditionByRoute' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ConditionByRoute', id);
    return await this.conditionByRouteService.deleteById(id);
  }
}
