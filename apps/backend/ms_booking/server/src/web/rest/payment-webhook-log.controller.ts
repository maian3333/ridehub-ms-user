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
import { PaymentWebhookLogDTO } from '../../service/dto/payment-webhook-log.dto';
import { PaymentWebhookLogService } from '../../service/payment-webhook-log.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/payment-webhook-logs')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('payment-webhook-logs')
export class PaymentWebhookLogController {
  logger = new Logger('PaymentWebhookLogController');

  constructor(private readonly paymentWebhookLogService: PaymentWebhookLogService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: PaymentWebhookLogDTO,
  })
  async getAll(@Req() req: Request): Promise<PaymentWebhookLogDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.paymentWebhookLogService.findAndCount({
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
    type: PaymentWebhookLogDTO,
  })
  async getOne(@Param('id') id: number): Promise<PaymentWebhookLogDTO> {
    return await this.paymentWebhookLogService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create paymentWebhookLog' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: PaymentWebhookLogDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() paymentWebhookLogDTO: PaymentWebhookLogDTO): Promise<PaymentWebhookLogDTO> {
    const created = await this.paymentWebhookLogService.save(paymentWebhookLogDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'PaymentWebhookLog', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update paymentWebhookLog' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: PaymentWebhookLogDTO,
  })
  async put(@Req() req: Request, @Body() paymentWebhookLogDTO: PaymentWebhookLogDTO): Promise<PaymentWebhookLogDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'PaymentWebhookLog', paymentWebhookLogDTO.id);
    return await this.paymentWebhookLogService.update(paymentWebhookLogDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update paymentWebhookLog with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: PaymentWebhookLogDTO,
  })
  async putId(@Req() req: Request, @Body() paymentWebhookLogDTO: PaymentWebhookLogDTO): Promise<PaymentWebhookLogDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'PaymentWebhookLog', paymentWebhookLogDTO.id);
    return await this.paymentWebhookLogService.update(paymentWebhookLogDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete paymentWebhookLog' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'PaymentWebhookLog', id);
    return await this.paymentWebhookLogService.deleteById(id);
  }
}
