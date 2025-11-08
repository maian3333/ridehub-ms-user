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
import { AppUserDTO } from '../../service/dto/app-user.dto';
import { AppUserService } from '../../service/app-user.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/app-users')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('app-users')
export class AppUserController {
  logger = new Logger('AppUserController');

  constructor(private readonly appUserService: AppUserService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: AppUserDTO,
  })
  async getAll(@Req() req: Request): Promise<AppUserDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.appUserService.findAndCount({
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
    type: AppUserDTO,
  })
  async getOne(@Param('id') id: number): Promise<AppUserDTO> {
    return await this.appUserService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create appUser' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: AppUserDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() appUserDTO: AppUserDTO): Promise<AppUserDTO> {
    const created = await this.appUserService.save(appUserDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'AppUser', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update appUser' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: AppUserDTO,
  })
  async put(@Req() req: Request, @Body() appUserDTO: AppUserDTO): Promise<AppUserDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'AppUser', appUserDTO.id);
    return await this.appUserService.update(appUserDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update appUser with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: AppUserDTO,
  })
  async putId(@Req() req: Request, @Body() appUserDTO: AppUserDTO): Promise<AppUserDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'AppUser', appUserDTO.id);
    return await this.appUserService.update(appUserDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete appUser' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'AppUser', id);
    return await this.appUserService.deleteById(id);
  }
}
