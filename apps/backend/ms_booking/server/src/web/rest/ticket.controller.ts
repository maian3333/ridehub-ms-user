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
import { TicketDTO } from '../../service/dto/ticket.dto';
import { TicketService } from '../../service/ticket.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tickets')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('tickets')
export class TicketController {
  logger = new Logger('TicketController');

  constructor(private readonly ticketService: TicketService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TicketDTO,
  })
  async getAll(@Req() req: Request): Promise<TicketDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.ticketService.findAndCount({
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
    type: TicketDTO,
  })
  async getOne(@Param('id') id: number): Promise<TicketDTO> {
    return await this.ticketService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create ticket' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TicketDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() ticketDTO: TicketDTO): Promise<TicketDTO> {
    const created = await this.ticketService.save(ticketDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Ticket', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update ticket' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TicketDTO,
  })
  async put(@Req() req: Request, @Body() ticketDTO: TicketDTO): Promise<TicketDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Ticket', ticketDTO.id);
    return await this.ticketService.update(ticketDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update ticket with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TicketDTO,
  })
  async putId(@Req() req: Request, @Body() ticketDTO: TicketDTO): Promise<TicketDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Ticket', ticketDTO.id);
    return await this.ticketService.update(ticketDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete ticket' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Ticket', id);
    return await this.ticketService.deleteById(id);
  }
}
