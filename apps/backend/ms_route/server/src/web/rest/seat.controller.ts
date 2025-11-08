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
import { SeatDTO } from '../../service/dto/seat.dto';
import { SeatService } from '../../service/seat.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/seats')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('seats')
export class SeatController {
  logger = new Logger('SeatController');

  constructor(private readonly seatService: SeatService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: SeatDTO,
  })
  async getAll(@Req() req: Request): Promise<SeatDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.seatService.findAndCount({
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
    type: SeatDTO,
  })
  async getOne(@Param('id') id: number): Promise<SeatDTO> {
    return await this.seatService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create seat' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: SeatDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() seatDTO: SeatDTO): Promise<SeatDTO> {
    const created = await this.seatService.save(seatDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Seat', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update seat' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: SeatDTO,
  })
  async put(@Req() req: Request, @Body() seatDTO: SeatDTO): Promise<SeatDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Seat', seatDTO.id);
    return await this.seatService.update(seatDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update seat with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: SeatDTO,
  })
  async putId(@Req() req: Request, @Body() seatDTO: SeatDTO): Promise<SeatDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Seat', seatDTO.id);
    return await this.seatService.update(seatDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete seat' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Seat', id);
    return await this.seatService.deleteById(id);
  }
}
