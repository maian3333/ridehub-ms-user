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
import { ConditionLocationItemDTO } from '../../service/dto/condition-location-item.dto';
import { ConditionLocationItemService } from '../../service/condition-location-item.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/condition-location-items')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('condition-location-items')
export class ConditionLocationItemController {
  logger = new Logger('ConditionLocationItemController');

  constructor(private readonly conditionLocationItemService: ConditionLocationItemService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ConditionLocationItemDTO,
  })
  async getAll(@Req() req: Request): Promise<ConditionLocationItemDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.conditionLocationItemService.findAndCount({
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
    type: ConditionLocationItemDTO,
  })
  async getOne(@Param('id') id: number): Promise<ConditionLocationItemDTO> {
    return await this.conditionLocationItemService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create conditionLocationItem' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ConditionLocationItemDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() conditionLocationItemDTO: ConditionLocationItemDTO): Promise<ConditionLocationItemDTO> {
    const created = await this.conditionLocationItemService.save(conditionLocationItemDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ConditionLocationItem', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update conditionLocationItem' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ConditionLocationItemDTO,
  })
  async put(@Req() req: Request, @Body() conditionLocationItemDTO: ConditionLocationItemDTO): Promise<ConditionLocationItemDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ConditionLocationItem', conditionLocationItemDTO.id);
    return await this.conditionLocationItemService.update(conditionLocationItemDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update conditionLocationItem with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ConditionLocationItemDTO,
  })
  async putId(@Req() req: Request, @Body() conditionLocationItemDTO: ConditionLocationItemDTO): Promise<ConditionLocationItemDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ConditionLocationItem', conditionLocationItemDTO.id);
    return await this.conditionLocationItemService.update(conditionLocationItemDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete conditionLocationItem' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ConditionLocationItem', id);
    return await this.conditionLocationItemService.deleteById(id);
  }
}
