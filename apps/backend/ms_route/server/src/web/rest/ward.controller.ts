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
import { WardDTO } from '../../service/dto/ward.dto';
import { WardService } from '../../service/ward.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/wards')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('wards')
export class WardController {
  logger = new Logger('WardController');

  constructor(private readonly wardService: WardService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: WardDTO,
  })
  async getAll(@Req() req: Request): Promise<WardDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.wardService.findAndCount({
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
    type: WardDTO,
  })
  async getOne(@Param('id') id: number): Promise<WardDTO> {
    return await this.wardService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create ward' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: WardDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() wardDTO: WardDTO): Promise<WardDTO> {
    const created = await this.wardService.save(wardDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Ward', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update ward' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: WardDTO,
  })
  async put(@Req() req: Request, @Body() wardDTO: WardDTO): Promise<WardDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Ward', wardDTO.id);
    return await this.wardService.update(wardDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update ward with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: WardDTO,
  })
  async putId(@Req() req: Request, @Body() wardDTO: WardDTO): Promise<WardDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Ward', wardDTO.id);
    return await this.wardService.update(wardDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete ward' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Ward', id);
    return await this.wardService.deleteById(id);
  }
}
