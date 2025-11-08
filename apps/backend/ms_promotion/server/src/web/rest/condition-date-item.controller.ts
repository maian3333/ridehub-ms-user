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
import { ConditionDateItemDTO } from '../../service/dto/condition-date-item.dto';
import { ConditionDateItemService } from '../../service/condition-date-item.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/condition-date-items')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('condition-date-items')
export class ConditionDateItemController {
  logger = new Logger('ConditionDateItemController');

  constructor(private readonly conditionDateItemService: ConditionDateItemService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ConditionDateItemDTO,
  })
  async getAll(@Req() req: Request): Promise<ConditionDateItemDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.conditionDateItemService.findAndCount({
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
    type: ConditionDateItemDTO,
  })
  async getOne(@Param('id') id: number): Promise<ConditionDateItemDTO> {
    return await this.conditionDateItemService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create conditionDateItem' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ConditionDateItemDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() conditionDateItemDTO: ConditionDateItemDTO): Promise<ConditionDateItemDTO> {
    const created = await this.conditionDateItemService.save(conditionDateItemDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ConditionDateItem', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update conditionDateItem' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ConditionDateItemDTO,
  })
  async put(@Req() req: Request, @Body() conditionDateItemDTO: ConditionDateItemDTO): Promise<ConditionDateItemDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ConditionDateItem', conditionDateItemDTO.id);
    return await this.conditionDateItemService.update(conditionDateItemDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update conditionDateItem with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ConditionDateItemDTO,
  })
  async putId(@Req() req: Request, @Body() conditionDateItemDTO: ConditionDateItemDTO): Promise<ConditionDateItemDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ConditionDateItem', conditionDateItemDTO.id);
    return await this.conditionDateItemService.update(conditionDateItemDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete conditionDateItem' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ConditionDateItem', id);
    return await this.conditionDateItemService.deleteById(id);
  }
}
