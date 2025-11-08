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
import { ConditionByLocationDTO } from '../../service/dto/condition-by-location.dto';
import { ConditionByLocationService } from '../../service/condition-by-location.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/condition-by-locations')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('condition-by-locations')
export class ConditionByLocationController {
  logger = new Logger('ConditionByLocationController');

  constructor(private readonly conditionByLocationService: ConditionByLocationService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ConditionByLocationDTO,
  })
  async getAll(@Req() req: Request): Promise<ConditionByLocationDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.conditionByLocationService.findAndCount({
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
    type: ConditionByLocationDTO,
  })
  async getOne(@Param('id') id: number): Promise<ConditionByLocationDTO> {
    return await this.conditionByLocationService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create conditionByLocation' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ConditionByLocationDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() conditionByLocationDTO: ConditionByLocationDTO): Promise<ConditionByLocationDTO> {
    const created = await this.conditionByLocationService.save(conditionByLocationDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ConditionByLocation', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update conditionByLocation' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ConditionByLocationDTO,
  })
  async put(@Req() req: Request, @Body() conditionByLocationDTO: ConditionByLocationDTO): Promise<ConditionByLocationDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ConditionByLocation', conditionByLocationDTO.id);
    return await this.conditionByLocationService.update(conditionByLocationDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update conditionByLocation with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ConditionByLocationDTO,
  })
  async putId(@Req() req: Request, @Body() conditionByLocationDTO: ConditionByLocationDTO): Promise<ConditionByLocationDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ConditionByLocation', conditionByLocationDTO.id);
    return await this.conditionByLocationService.update(conditionByLocationDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete conditionByLocation' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ConditionByLocation', id);
    return await this.conditionByLocationService.deleteById(id);
  }
}
