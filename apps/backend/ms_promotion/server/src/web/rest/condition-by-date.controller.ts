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
import { ConditionByDateDTO } from '../../service/dto/condition-by-date.dto';
import { ConditionByDateService } from '../../service/condition-by-date.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/condition-by-dates')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('condition-by-dates')
export class ConditionByDateController {
  logger = new Logger('ConditionByDateController');

  constructor(private readonly conditionByDateService: ConditionByDateService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ConditionByDateDTO,
  })
  async getAll(@Req() req: Request): Promise<ConditionByDateDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.conditionByDateService.findAndCount({
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
    type: ConditionByDateDTO,
  })
  async getOne(@Param('id') id: number): Promise<ConditionByDateDTO> {
    return await this.conditionByDateService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create conditionByDate' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ConditionByDateDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() conditionByDateDTO: ConditionByDateDTO): Promise<ConditionByDateDTO> {
    const created = await this.conditionByDateService.save(conditionByDateDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ConditionByDate', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update conditionByDate' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ConditionByDateDTO,
  })
  async put(@Req() req: Request, @Body() conditionByDateDTO: ConditionByDateDTO): Promise<ConditionByDateDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ConditionByDate', conditionByDateDTO.id);
    return await this.conditionByDateService.update(conditionByDateDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update conditionByDate with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ConditionByDateDTO,
  })
  async putId(@Req() req: Request, @Body() conditionByDateDTO: ConditionByDateDTO): Promise<ConditionByDateDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ConditionByDate', conditionByDateDTO.id);
    return await this.conditionByDateService.update(conditionByDateDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete conditionByDate' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ConditionByDate', id);
    return await this.conditionByDateService.deleteById(id);
  }
}
