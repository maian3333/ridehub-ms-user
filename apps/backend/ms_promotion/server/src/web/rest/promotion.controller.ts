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
import { PromotionDTO } from '../../service/dto/promotion.dto';
import { PromotionService } from '../../service/promotion.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/promotions')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('promotions')
export class PromotionController {
  logger = new Logger('PromotionController');

  constructor(private readonly promotionService: PromotionService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: PromotionDTO,
  })
  async getAll(@Req() req: Request): Promise<PromotionDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.promotionService.findAndCount({
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
    type: PromotionDTO,
  })
  async getOne(@Param('id') id: number): Promise<PromotionDTO> {
    return await this.promotionService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create promotion' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: PromotionDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() promotionDTO: PromotionDTO): Promise<PromotionDTO> {
    const created = await this.promotionService.save(promotionDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Promotion', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update promotion' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: PromotionDTO,
  })
  async put(@Req() req: Request, @Body() promotionDTO: PromotionDTO): Promise<PromotionDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Promotion', promotionDTO.id);
    return await this.promotionService.update(promotionDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update promotion with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: PromotionDTO,
  })
  async putId(@Req() req: Request, @Body() promotionDTO: PromotionDTO): Promise<PromotionDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Promotion', promotionDTO.id);
    return await this.promotionService.update(promotionDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete promotion' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Promotion', id);
    return await this.promotionService.deleteById(id);
  }
}
