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
import { AttendantDTO } from '../../service/dto/attendant.dto';
import { AttendantService } from '../../service/attendant.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/attendants')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('attendants')
export class AttendantController {
  logger = new Logger('AttendantController');

  constructor(private readonly attendantService: AttendantService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: AttendantDTO,
  })
  async getAll(@Req() req: Request): Promise<AttendantDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.attendantService.findAndCount({
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
    type: AttendantDTO,
  })
  async getOne(@Param('id') id: number): Promise<AttendantDTO> {
    return await this.attendantService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create attendant' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: AttendantDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() attendantDTO: AttendantDTO): Promise<AttendantDTO> {
    const created = await this.attendantService.save(attendantDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Attendant', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update attendant' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: AttendantDTO,
  })
  async put(@Req() req: Request, @Body() attendantDTO: AttendantDTO): Promise<AttendantDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Attendant', attendantDTO.id);
    return await this.attendantService.update(attendantDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update attendant with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: AttendantDTO,
  })
  async putId(@Req() req: Request, @Body() attendantDTO: AttendantDTO): Promise<AttendantDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Attendant', attendantDTO.id);
    return await this.attendantService.update(attendantDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete attendant' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Attendant', id);
    return await this.attendantService.deleteById(id);
  }
}
