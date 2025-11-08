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
import { SeatLockDTO } from '../../service/dto/seat-lock.dto';
import { SeatLockService } from '../../service/seat-lock.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/seat-locks')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('seat-locks')
export class SeatLockController {
  logger = new Logger('SeatLockController');

  constructor(private readonly seatLockService: SeatLockService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: SeatLockDTO,
  })
  async getAll(@Req() req: Request): Promise<SeatLockDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.seatLockService.findAndCount({
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
    type: SeatLockDTO,
  })
  async getOne(@Param('id') id: number): Promise<SeatLockDTO> {
    return await this.seatLockService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create seatLock' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: SeatLockDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() seatLockDTO: SeatLockDTO): Promise<SeatLockDTO> {
    const created = await this.seatLockService.save(seatLockDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'SeatLock', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update seatLock' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: SeatLockDTO,
  })
  async put(@Req() req: Request, @Body() seatLockDTO: SeatLockDTO): Promise<SeatLockDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'SeatLock', seatLockDTO.id);
    return await this.seatLockService.update(seatLockDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update seatLock with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: SeatLockDTO,
  })
  async putId(@Req() req: Request, @Body() seatLockDTO: SeatLockDTO): Promise<SeatLockDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'SeatLock', seatLockDTO.id);
    return await this.seatLockService.update(seatLockDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete seatLock' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'SeatLock', id);
    return await this.seatLockService.deleteById(id);
  }
}
