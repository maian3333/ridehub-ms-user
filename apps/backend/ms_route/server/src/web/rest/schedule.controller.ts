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
import { ScheduleDTO } from '../../service/dto/schedule.dto';
import { ScheduleService } from '../../service/schedule.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/schedules')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('schedules')
export class ScheduleController {
  logger = new Logger('ScheduleController');

  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ScheduleDTO,
  })
  async getAll(@Req() req: Request): Promise<ScheduleDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.scheduleService.findAndCount({
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
    type: ScheduleDTO,
  })
  async getOne(@Param('id') id: number): Promise<ScheduleDTO> {
    return await this.scheduleService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create schedule' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ScheduleDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() scheduleDTO: ScheduleDTO): Promise<ScheduleDTO> {
    const created = await this.scheduleService.save(scheduleDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Schedule', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update schedule' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ScheduleDTO,
  })
  async put(@Req() req: Request, @Body() scheduleDTO: ScheduleDTO): Promise<ScheduleDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Schedule', scheduleDTO.id);
    return await this.scheduleService.update(scheduleDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update schedule with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ScheduleDTO,
  })
  async putId(@Req() req: Request, @Body() scheduleDTO: ScheduleDTO): Promise<ScheduleDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Schedule', scheduleDTO.id);
    return await this.scheduleService.update(scheduleDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete schedule' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Schedule', id);
    return await this.scheduleService.deleteById(id);
  }
}
