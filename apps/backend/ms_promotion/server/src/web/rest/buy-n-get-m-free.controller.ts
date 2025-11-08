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
import { BuyNGetMFreeDTO } from '../../service/dto/buy-n-get-m-free.dto';
import { BuyNGetMFreeService } from '../../service/buy-n-get-m-free.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/buy-n-get-m-frees')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('buy-n-get-m-frees')
export class BuyNGetMFreeController {
  logger = new Logger('BuyNGetMFreeController');

  constructor(private readonly buyNGetMFreeService: BuyNGetMFreeService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: BuyNGetMFreeDTO,
  })
  async getAll(@Req() req: Request): Promise<BuyNGetMFreeDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.buyNGetMFreeService.findAndCount({
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
    type: BuyNGetMFreeDTO,
  })
  async getOne(@Param('id') id: number): Promise<BuyNGetMFreeDTO> {
    return await this.buyNGetMFreeService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create buyNGetMFree' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: BuyNGetMFreeDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() buyNGetMFreeDTO: BuyNGetMFreeDTO): Promise<BuyNGetMFreeDTO> {
    const created = await this.buyNGetMFreeService.save(buyNGetMFreeDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'BuyNGetMFree', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update buyNGetMFree' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: BuyNGetMFreeDTO,
  })
  async put(@Req() req: Request, @Body() buyNGetMFreeDTO: BuyNGetMFreeDTO): Promise<BuyNGetMFreeDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'BuyNGetMFree', buyNGetMFreeDTO.id);
    return await this.buyNGetMFreeService.update(buyNGetMFreeDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update buyNGetMFree with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: BuyNGetMFreeDTO,
  })
  async putId(@Req() req: Request, @Body() buyNGetMFreeDTO: BuyNGetMFreeDTO): Promise<BuyNGetMFreeDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'BuyNGetMFree', buyNGetMFreeDTO.id);
    return await this.buyNGetMFreeService.update(buyNGetMFreeDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete buyNGetMFree' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'BuyNGetMFree', id);
    return await this.buyNGetMFreeService.deleteById(id);
  }
}
