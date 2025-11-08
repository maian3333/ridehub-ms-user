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
import { BookingDTO } from '../../service/dto/booking.dto';
import { BookingService } from '../../service/booking.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/bookings')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('bookings')
export class BookingController {
  logger = new Logger('BookingController');

  constructor(private readonly bookingService: BookingService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: BookingDTO,
  })
  async getAll(@Req() req: Request): Promise<BookingDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.bookingService.findAndCount({
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
    type: BookingDTO,
  })
  async getOne(@Param('id') id: number): Promise<BookingDTO> {
    return await this.bookingService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create booking' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: BookingDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() bookingDTO: BookingDTO): Promise<BookingDTO> {
    const created = await this.bookingService.save(bookingDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Booking', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update booking' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: BookingDTO,
  })
  async put(@Req() req: Request, @Body() bookingDTO: BookingDTO): Promise<BookingDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Booking', bookingDTO.id);
    return await this.bookingService.update(bookingDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update booking with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: BookingDTO,
  })
  async putId(@Req() req: Request, @Body() bookingDTO: BookingDTO): Promise<BookingDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Booking', bookingDTO.id);
    return await this.bookingService.update(bookingDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete booking' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Booking', id);
    return await this.bookingService.deleteById(id);
  }
}
