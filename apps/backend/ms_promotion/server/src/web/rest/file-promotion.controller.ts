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
import { FilePromotionDTO } from '../../service/dto/file-promotion.dto';
import { FilePromotionService } from '../../service/file-promotion.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/file-promotions')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('file-promotions')
export class FilePromotionController {
  logger = new Logger('FilePromotionController');

  constructor(private readonly filePromotionService: FilePromotionService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: FilePromotionDTO,
  })
  async getAll(@Req() req: Request): Promise<FilePromotionDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.filePromotionService.findAndCount({
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
    type: FilePromotionDTO,
  })
  async getOne(@Param('id') id: number): Promise<FilePromotionDTO> {
    return await this.filePromotionService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create filePromotion' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: FilePromotionDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() filePromotionDTO: FilePromotionDTO): Promise<FilePromotionDTO> {
    const created = await this.filePromotionService.save(filePromotionDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'FilePromotion', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update filePromotion' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: FilePromotionDTO,
  })
  async put(@Req() req: Request, @Body() filePromotionDTO: FilePromotionDTO): Promise<FilePromotionDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'FilePromotion', filePromotionDTO.id);
    return await this.filePromotionService.update(filePromotionDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update filePromotion with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: FilePromotionDTO,
  })
  async putId(@Req() req: Request, @Body() filePromotionDTO: FilePromotionDTO): Promise<FilePromotionDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'FilePromotion', filePromotionDTO.id);
    return await this.filePromotionService.update(filePromotionDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete filePromotion' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'FilePromotion', id);
    return await this.filePromotionService.deleteById(id);
  }
}
