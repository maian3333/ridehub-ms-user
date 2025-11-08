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
import { PaymentTransactionDTO } from '../../service/dto/payment-transaction.dto';
import { PaymentTransactionService } from '../../service/payment-transaction.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/payment-transactions')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('payment-transactions')
export class PaymentTransactionController {
  logger = new Logger('PaymentTransactionController');

  constructor(private readonly paymentTransactionService: PaymentTransactionService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: PaymentTransactionDTO,
  })
  async getAll(@Req() req: Request): Promise<PaymentTransactionDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.paymentTransactionService.findAndCount({
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
    type: PaymentTransactionDTO,
  })
  async getOne(@Param('id') id: number): Promise<PaymentTransactionDTO> {
    return await this.paymentTransactionService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create paymentTransaction' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: PaymentTransactionDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() paymentTransactionDTO: PaymentTransactionDTO): Promise<PaymentTransactionDTO> {
    const created = await this.paymentTransactionService.save(paymentTransactionDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'PaymentTransaction', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update paymentTransaction' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: PaymentTransactionDTO,
  })
  async put(@Req() req: Request, @Body() paymentTransactionDTO: PaymentTransactionDTO): Promise<PaymentTransactionDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'PaymentTransaction', paymentTransactionDTO.id);
    return await this.paymentTransactionService.update(paymentTransactionDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update paymentTransaction with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: PaymentTransactionDTO,
  })
  async putId(@Req() req: Request, @Body() paymentTransactionDTO: PaymentTransactionDTO): Promise<PaymentTransactionDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'PaymentTransaction', paymentTransactionDTO.id);
    return await this.paymentTransactionService.update(paymentTransactionDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete paymentTransaction' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'PaymentTransaction', id);
    return await this.paymentTransactionService.deleteById(id);
  }
}
