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
import { FileBookingDTO } from '../../service/dto/file-booking.dto';
import { FileBookingService } from '../../service/file-booking.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/file-bookings')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('file-bookings')
export class FileBookingController {
  logger = new Logger('FileBookingController');

  constructor(private readonly fileBookingService: FileBookingService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: FileBookingDTO,
  })
  async getAll(@Req() req: Request): Promise<FileBookingDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.fileBookingService.findAndCount({
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
    type: FileBookingDTO,
  })
  async getOne(@Param('id') id: number): Promise<FileBookingDTO> {
    return await this.fileBookingService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create fileBooking' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: FileBookingDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() fileBookingDTO: FileBookingDTO): Promise<FileBookingDTO> {
    const created = await this.fileBookingService.save(fileBookingDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'FileBooking', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update fileBooking' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: FileBookingDTO,
  })
  async put(@Req() req: Request, @Body() fileBookingDTO: FileBookingDTO): Promise<FileBookingDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'FileBooking', fileBookingDTO.id);
    return await this.fileBookingService.update(fileBookingDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update fileBooking with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: FileBookingDTO,
  })
  async putId(@Req() req: Request, @Body() fileBookingDTO: FileBookingDTO): Promise<FileBookingDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'FileBooking', fileBookingDTO.id);
    return await this.fileBookingService.update(fileBookingDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete fileBooking' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'FileBooking', id);
    return await this.fileBookingService.deleteById(id);
  }
}
