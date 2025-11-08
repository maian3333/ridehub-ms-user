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
import { ScheduleOccasionDTO } from '../../service/dto/schedule-occasion.dto';
import { ScheduleOccasionService } from '../../service/schedule-occasion.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/schedule-occasions')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('schedule-occasions')
export class ScheduleOccasionController {
  logger = new Logger('ScheduleOccasionController');

  constructor(private readonly scheduleOccasionService: ScheduleOccasionService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ScheduleOccasionDTO,
  })
  async getAll(@Req() req: Request): Promise<ScheduleOccasionDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.scheduleOccasionService.findAndCount({
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
    type: ScheduleOccasionDTO,
  })
  async getOne(@Param('id') id: number): Promise<ScheduleOccasionDTO> {
    return await this.scheduleOccasionService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create scheduleOccasion' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ScheduleOccasionDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() scheduleOccasionDTO: ScheduleOccasionDTO): Promise<ScheduleOccasionDTO> {
    const created = await this.scheduleOccasionService.save(scheduleOccasionDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ScheduleOccasion', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update scheduleOccasion' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ScheduleOccasionDTO,
  })
  async put(@Req() req: Request, @Body() scheduleOccasionDTO: ScheduleOccasionDTO): Promise<ScheduleOccasionDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ScheduleOccasion', scheduleOccasionDTO.id);
    return await this.scheduleOccasionService.update(scheduleOccasionDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update scheduleOccasion with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ScheduleOccasionDTO,
  })
  async putId(@Req() req: Request, @Body() scheduleOccasionDTO: ScheduleOccasionDTO): Promise<ScheduleOccasionDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'ScheduleOccasion', scheduleOccasionDTO.id);
    return await this.scheduleOccasionService.update(scheduleOccasionDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete scheduleOccasion' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'ScheduleOccasion', id);
    return await this.scheduleOccasionService.deleteById(id);
  }
}
