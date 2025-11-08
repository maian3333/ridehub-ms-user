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
import { VehicleDTO } from '../../service/dto/vehicle.dto';
import { VehicleService } from '../../service/vehicle.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/vehicles')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('vehicles')
export class VehicleController {
  logger = new Logger('VehicleController');

  constructor(private readonly vehicleService: VehicleService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: VehicleDTO,
  })
  async getAll(@Req() req: Request): Promise<VehicleDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.vehicleService.findAndCount({
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
    type: VehicleDTO,
  })
  async getOne(@Param('id') id: number): Promise<VehicleDTO> {
    return await this.vehicleService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create vehicle' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: VehicleDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() vehicleDTO: VehicleDTO): Promise<VehicleDTO> {
    const created = await this.vehicleService.save(vehicleDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Vehicle', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update vehicle' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: VehicleDTO,
  })
  async put(@Req() req: Request, @Body() vehicleDTO: VehicleDTO): Promise<VehicleDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Vehicle', vehicleDTO.id);
    return await this.vehicleService.update(vehicleDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update vehicle with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: VehicleDTO,
  })
  async putId(@Req() req: Request, @Body() vehicleDTO: VehicleDTO): Promise<VehicleDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Vehicle', vehicleDTO.id);
    return await this.vehicleService.update(vehicleDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete vehicle' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Vehicle', id);
    return await this.vehicleService.deleteById(id);
  }
}
