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
import { PricingSnapshotDTO } from '../../service/dto/pricing-snapshot.dto';
import { PricingSnapshotService } from '../../service/pricing-snapshot.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/pricing-snapshots')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('pricing-snapshots')
export class PricingSnapshotController {
  logger = new Logger('PricingSnapshotController');

  constructor(private readonly pricingSnapshotService: PricingSnapshotService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: PricingSnapshotDTO,
  })
  async getAll(@Req() req: Request): Promise<PricingSnapshotDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.pricingSnapshotService.findAndCount({
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
    type: PricingSnapshotDTO,
  })
  async getOne(@Param('id') id: number): Promise<PricingSnapshotDTO> {
    return await this.pricingSnapshotService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create pricingSnapshot' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: PricingSnapshotDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() pricingSnapshotDTO: PricingSnapshotDTO): Promise<PricingSnapshotDTO> {
    const created = await this.pricingSnapshotService.save(pricingSnapshotDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'PricingSnapshot', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update pricingSnapshot' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: PricingSnapshotDTO,
  })
  async put(@Req() req: Request, @Body() pricingSnapshotDTO: PricingSnapshotDTO): Promise<PricingSnapshotDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'PricingSnapshot', pricingSnapshotDTO.id);
    return await this.pricingSnapshotService.update(pricingSnapshotDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update pricingSnapshot with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: PricingSnapshotDTO,
  })
  async putId(@Req() req: Request, @Body() pricingSnapshotDTO: PricingSnapshotDTO): Promise<PricingSnapshotDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'PricingSnapshot', pricingSnapshotDTO.id);
    return await this.pricingSnapshotService.update(pricingSnapshotDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete pricingSnapshot' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'PricingSnapshot', id);
    return await this.pricingSnapshotService.deleteById(id);
  }
}
