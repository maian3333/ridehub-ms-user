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
import { ProvinceDTO } from '../../service/dto/province.dto';
import { ProvinceService } from '../../service/province.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/provinces')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('provinces')
export class ProvinceController {
  logger = new Logger('ProvinceController');

  constructor(private readonly provinceService: ProvinceService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: ProvinceDTO,
  })
  async getAll(@Req() req: Request): Promise<ProvinceDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.provinceService.findAndCount({
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
    type: ProvinceDTO,
  })
  async getOne(@Param('id') id: number): Promise<ProvinceDTO> {
    return await this.provinceService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create province' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ProvinceDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() provinceDTO: ProvinceDTO): Promise<ProvinceDTO> {
    const created = await this.provinceService.save(provinceDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Province', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update province' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ProvinceDTO,
  })
  async put(@Req() req: Request, @Body() provinceDTO: ProvinceDTO): Promise<ProvinceDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Province', provinceDTO.id);
    return await this.provinceService.update(provinceDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update province with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ProvinceDTO,
  })
  async putId(@Req() req: Request, @Body() provinceDTO: ProvinceDTO): Promise<ProvinceDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Province', provinceDTO.id);
    return await this.provinceService.update(provinceDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete province' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Province', id);
    return await this.provinceService.deleteById(id);
  }
}
