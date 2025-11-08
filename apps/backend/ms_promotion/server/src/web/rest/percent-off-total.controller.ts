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
import { PercentOffTotalDTO } from '../../service/dto/percent-off-total.dto';
import { PercentOffTotalService } from '../../service/percent-off-total.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/percent-off-totals')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('percent-off-totals')
export class PercentOffTotalController {
  logger = new Logger('PercentOffTotalController');

  constructor(private readonly percentOffTotalService: PercentOffTotalService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: PercentOffTotalDTO,
  })
  async getAll(@Req() req: Request): Promise<PercentOffTotalDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.percentOffTotalService.findAndCount({
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
    type: PercentOffTotalDTO,
  })
  async getOne(@Param('id') id: number): Promise<PercentOffTotalDTO> {
    return await this.percentOffTotalService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create percentOffTotal' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: PercentOffTotalDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() percentOffTotalDTO: PercentOffTotalDTO): Promise<PercentOffTotalDTO> {
    const created = await this.percentOffTotalService.save(percentOffTotalDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'PercentOffTotal', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update percentOffTotal' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: PercentOffTotalDTO,
  })
  async put(@Req() req: Request, @Body() percentOffTotalDTO: PercentOffTotalDTO): Promise<PercentOffTotalDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'PercentOffTotal', percentOffTotalDTO.id);
    return await this.percentOffTotalService.update(percentOffTotalDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update percentOffTotal with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: PercentOffTotalDTO,
  })
  async putId(@Req() req: Request, @Body() percentOffTotalDTO: PercentOffTotalDTO): Promise<PercentOffTotalDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'PercentOffTotal', percentOffTotalDTO.id);
    return await this.percentOffTotalService.update(percentOffTotalDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete percentOffTotal' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'PercentOffTotal', id);
    return await this.percentOffTotalService.deleteById(id);
  }
}
