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
import { AppliedPromotionDTO } from '../../service/dto/applied-promotion.dto';
import { AppliedPromotionService } from '../../service/applied-promotion.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/applied-promotions')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('applied-promotions')
export class AppliedPromotionController {
  logger = new Logger('AppliedPromotionController');

  constructor(private readonly appliedPromotionService: AppliedPromotionService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: AppliedPromotionDTO,
  })
  async getAll(@Req() req: Request): Promise<AppliedPromotionDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.appliedPromotionService.findAndCount({
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
    type: AppliedPromotionDTO,
  })
  async getOne(@Param('id') id: number): Promise<AppliedPromotionDTO> {
    return await this.appliedPromotionService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create appliedPromotion' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: AppliedPromotionDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() appliedPromotionDTO: AppliedPromotionDTO): Promise<AppliedPromotionDTO> {
    const created = await this.appliedPromotionService.save(appliedPromotionDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'AppliedPromotion', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update appliedPromotion' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: AppliedPromotionDTO,
  })
  async put(@Req() req: Request, @Body() appliedPromotionDTO: AppliedPromotionDTO): Promise<AppliedPromotionDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'AppliedPromotion', appliedPromotionDTO.id);
    return await this.appliedPromotionService.update(appliedPromotionDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update appliedPromotion with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: AppliedPromotionDTO,
  })
  async putId(@Req() req: Request, @Body() appliedPromotionDTO: AppliedPromotionDTO): Promise<AppliedPromotionDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'AppliedPromotion', appliedPromotionDTO.id);
    return await this.appliedPromotionService.update(appliedPromotionDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete appliedPromotion' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'AppliedPromotion', id);
    return await this.appliedPromotionService.deleteById(id);
  }
}
