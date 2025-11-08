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
import { FloorDTO } from '../../service/dto/floor.dto';
import { FloorService } from '../../service/floor.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/floors')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('floors')
export class FloorController {
  logger = new Logger('FloorController');

  constructor(private readonly floorService: FloorService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: FloorDTO,
  })
  async getAll(@Req() req: Request): Promise<FloorDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.floorService.findAndCount({
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
    type: FloorDTO,
  })
  async getOne(@Param('id') id: number): Promise<FloorDTO> {
    return await this.floorService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create floor' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: FloorDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() floorDTO: FloorDTO): Promise<FloorDTO> {
    const created = await this.floorService.save(floorDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Floor', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update floor' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: FloorDTO,
  })
  async put(@Req() req: Request, @Body() floorDTO: FloorDTO): Promise<FloorDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Floor', floorDTO.id);
    return await this.floorService.update(floorDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update floor with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: FloorDTO,
  })
  async putId(@Req() req: Request, @Body() floorDTO: FloorDTO): Promise<FloorDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Floor', floorDTO.id);
    return await this.floorService.update(floorDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete floor' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Floor', id);
    return await this.floorService.deleteById(id);
  }
}
