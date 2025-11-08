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
import { ConditionRouteItemDTO } from '../../service/dto/condition-route-item.dto';
import { ConditionRouteItemService } from '../../service/condition-route-item.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/condition-route-items')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('condition-route-items')
export class ConditionRouteItemController {
  logger = new Logger('ConditionRouteItemController');

  constructor(private readonly conditionRouteItemService: ConditionRouteItemService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ConditionRouteItemDTO,
  })
  async getAll(@Req() req: Request): Promise<ConditionRouteItemDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.conditionRouteItemService.findAndCount({
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
    type: ConditionRouteItemDTO,
  })
  async getOne(@Param('id') id: number): Promise<ConditionRouteItemDTO> {
    return await this.conditionRouteItemService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create conditionRouteItem' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ConditionRouteItemDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() conditionRouteItemDTO: ConditionRouteItemDTO): Promise<ConditionRouteItemDTO> {
    const created = await this.conditionRouteItemService.save(conditionRouteItemDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ConditionRouteItem', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update conditionRouteItem' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ConditionRouteItemDTO,
  })
  async put(@Req() req: Request, @Body() conditionRouteItemDTO: ConditionRouteItemDTO): Promise<ConditionRouteItemDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ConditionRouteItem', conditionRouteItemDTO.id);
    return await this.conditionRouteItemService.update(conditionRouteItemDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update conditionRouteItem with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ConditionRouteItemDTO,
  })
  async putId(@Req() req: Request, @Body() conditionRouteItemDTO: ConditionRouteItemDTO): Promise<ConditionRouteItemDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ConditionRouteItem', conditionRouteItemDTO.id);
    return await this.conditionRouteItemService.update(conditionRouteItemDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete conditionRouteItem' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ConditionRouteItem', id);
    return await this.conditionRouteItemService.deleteById(id);
  }
}
