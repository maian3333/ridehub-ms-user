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
import { StaffDTO } from '../../service/dto/staff.dto';
import { StaffService } from '../../service/staff.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/staff')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('staff')
export class StaffController {
  logger = new Logger('StaffController');

  constructor(private readonly staffService: StaffService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: StaffDTO,
  })
  async getAll(@Req() req: Request): Promise<StaffDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.staffService.findAndCount({
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
    type: StaffDTO,
  })
  async getOne(@Param('id') id: number): Promise<StaffDTO> {
    return await this.staffService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create staff' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: StaffDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() staffDTO: StaffDTO): Promise<StaffDTO> {
    const created = await this.staffService.save(staffDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Staff', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update staff' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: StaffDTO,
  })
  async put(@Req() req: Request, @Body() staffDTO: StaffDTO): Promise<StaffDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Staff', staffDTO.id);
    return await this.staffService.update(staffDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update staff with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: StaffDTO,
  })
  async putId(@Req() req: Request, @Body() staffDTO: StaffDTO): Promise<StaffDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Staff', staffDTO.id);
    return await this.staffService.update(staffDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete staff' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Staff', id);
    return await this.staffService.deleteById(id);
  }
}
