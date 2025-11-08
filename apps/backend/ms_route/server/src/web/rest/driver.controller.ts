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
import { DriverDTO } from '../../service/dto/driver.dto';
import { DriverService } from '../../service/driver.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/drivers')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('drivers')
export class DriverController {
  logger = new Logger('DriverController');

  constructor(private readonly driverService: DriverService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: DriverDTO,
  })
  async getAll(@Req() req: Request): Promise<DriverDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.driverService.findAndCount({
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
    type: DriverDTO,
  })
  async getOne(@Param('id') id: number): Promise<DriverDTO> {
    return await this.driverService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create driver' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: DriverDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() driverDTO: DriverDTO): Promise<DriverDTO> {
    const created = await this.driverService.save(driverDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Driver', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update driver' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: DriverDTO,
  })
  async put(@Req() req: Request, @Body() driverDTO: DriverDTO): Promise<DriverDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Driver', driverDTO.id);
    return await this.driverService.update(driverDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update driver with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: DriverDTO,
  })
  async putId(@Req() req: Request, @Body() driverDTO: DriverDTO): Promise<DriverDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Driver', driverDTO.id);
    return await this.driverService.update(driverDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete driver' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Driver', id);
    return await this.driverService.deleteById(id);
  }
}
