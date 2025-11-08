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
import { ScheduleTimeSlotDTO } from '../../service/dto/schedule-time-slot.dto';
import { ScheduleTimeSlotService } from '../../service/schedule-time-slot.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/schedule-time-slots')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('schedule-time-slots')
export class ScheduleTimeSlotController {
  logger = new Logger('ScheduleTimeSlotController');

  constructor(private readonly scheduleTimeSlotService: ScheduleTimeSlotService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ScheduleTimeSlotDTO,
  })
  async getAll(@Req() req: Request): Promise<ScheduleTimeSlotDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.scheduleTimeSlotService.findAndCount({
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
    type: ScheduleTimeSlotDTO,
  })
  async getOne(@Param('id') id: number): Promise<ScheduleTimeSlotDTO> {
    return await this.scheduleTimeSlotService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create scheduleTimeSlot' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ScheduleTimeSlotDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() scheduleTimeSlotDTO: ScheduleTimeSlotDTO): Promise<ScheduleTimeSlotDTO> {
    const created = await this.scheduleTimeSlotService.save(scheduleTimeSlotDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ScheduleTimeSlot', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update scheduleTimeSlot' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ScheduleTimeSlotDTO,
  })
  async put(@Req() req: Request, @Body() scheduleTimeSlotDTO: ScheduleTimeSlotDTO): Promise<ScheduleTimeSlotDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ScheduleTimeSlot', scheduleTimeSlotDTO.id);
    return await this.scheduleTimeSlotService.update(scheduleTimeSlotDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update scheduleTimeSlot with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ScheduleTimeSlotDTO,
  })
  async putId(@Req() req: Request, @Body() scheduleTimeSlotDTO: ScheduleTimeSlotDTO): Promise<ScheduleTimeSlotDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ScheduleTimeSlot', scheduleTimeSlotDTO.id);
    return await this.scheduleTimeSlotService.update(scheduleTimeSlotDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete scheduleTimeSlot' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ScheduleTimeSlot', id);
    return await this.scheduleTimeSlotService.deleteById(id);
  }
}
