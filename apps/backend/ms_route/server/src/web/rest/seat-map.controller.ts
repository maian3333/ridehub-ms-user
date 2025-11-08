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
import { SeatMapDTO } from '../../service/dto/seat-map.dto';
import { SeatMapService } from '../../service/seat-map.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/seat-maps')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('seat-maps')
export class SeatMapController {
  logger = new Logger('SeatMapController');

  constructor(private readonly seatMapService: SeatMapService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: SeatMapDTO,
  })
  async getAll(@Req() req: Request): Promise<SeatMapDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.seatMapService.findAndCount({
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
    type: SeatMapDTO,
  })
  async getOne(@Param('id') id: number): Promise<SeatMapDTO> {
    return await this.seatMapService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create seatMap' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: SeatMapDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() seatMapDTO: SeatMapDTO): Promise<SeatMapDTO> {
    const created = await this.seatMapService.save(seatMapDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'SeatMap', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update seatMap' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: SeatMapDTO,
  })
  async put(@Req() req: Request, @Body() seatMapDTO: SeatMapDTO): Promise<SeatMapDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'SeatMap', seatMapDTO.id);
    return await this.seatMapService.update(seatMapDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update seatMap with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: SeatMapDTO,
  })
  async putId(@Req() req: Request, @Body() seatMapDTO: SeatMapDTO): Promise<SeatMapDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'SeatMap', seatMapDTO.id);
    return await this.seatMapService.update(seatMapDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete seatMap' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'SeatMap', id);
    return await this.seatMapService.deleteById(id);
  }
}
