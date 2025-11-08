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
import { TripDTO } from '../../service/dto/trip.dto';
import { TripService } from '../../service/trip.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/trips')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('trips')
export class TripController {
  logger = new Logger('TripController');

  constructor(private readonly tripService: TripService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TripDTO,
  })
  async getAll(@Req() req: Request): Promise<TripDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.tripService.findAndCount({
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
    type: TripDTO,
  })
  async getOne(@Param('id') id: number): Promise<TripDTO> {
    return await this.tripService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create trip' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TripDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tripDTO: TripDTO): Promise<TripDTO> {
    const created = await this.tripService.save(tripDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Trip', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update trip' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TripDTO,
  })
  async put(@Req() req: Request, @Body() tripDTO: TripDTO): Promise<TripDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Trip', tripDTO.id);
    return await this.tripService.update(tripDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update trip with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TripDTO,
  })
  async putId(@Req() req: Request, @Body() tripDTO: TripDTO): Promise<TripDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Trip', tripDTO.id);
    return await this.tripService.update(tripDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete trip' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Trip', id);
    return await this.tripService.deleteById(id);
  }
}
