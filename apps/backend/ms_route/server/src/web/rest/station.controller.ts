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
import { StationDTO } from '../../service/dto/station.dto';
import { StationService } from '../../service/station.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/stations')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('stations')
export class StationController {
  logger = new Logger('StationController');

  constructor(private readonly stationService: StationService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: StationDTO,
  })
  async getAll(@Req() req: Request): Promise<StationDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.stationService.findAndCount({
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
    type: StationDTO,
  })
  async getOne(@Param('id') id: number): Promise<StationDTO> {
    return await this.stationService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create station' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: StationDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() stationDTO: StationDTO): Promise<StationDTO> {
    const created = await this.stationService.save(stationDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Station', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update station' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: StationDTO,
  })
  async put(@Req() req: Request, @Body() stationDTO: StationDTO): Promise<StationDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Station', stationDTO.id);
    return await this.stationService.update(stationDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update station with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: StationDTO,
  })
  async putId(@Req() req: Request, @Body() stationDTO: StationDTO): Promise<StationDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Station', stationDTO.id);
    return await this.stationService.update(stationDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete station' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Station', id);
    return await this.stationService.deleteById(id);
  }
}
