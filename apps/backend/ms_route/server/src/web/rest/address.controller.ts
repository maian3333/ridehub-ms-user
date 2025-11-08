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
import { AddressDTO } from '../../service/dto/address.dto';
import { AddressService } from '../../service/address.service';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/addresses')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiSecurity({})
@ApiTags('addresses')
export class AddressController {
  logger = new Logger('AddressController');

  constructor(private readonly addressService: AddressService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: AddressDTO,
  })
  async getAll(@Req() req: Request): Promise<AddressDTO[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort ?? 'id,ASC');
    const [results, count] = await this.addressService.findAndCount({
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
    type: AddressDTO,
  })
  async getOne(@Param('id') id: number): Promise<AddressDTO> {
    return await this.addressService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Create address' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: AddressDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() addressDTO: AddressDTO): Promise<AddressDTO> {
    const created = await this.addressService.save(addressDTO, req.user?.login);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Address', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update address' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: AddressDTO,
  })
  async put(@Req() req: Request, @Body() addressDTO: AddressDTO): Promise<AddressDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Address', addressDTO.id);
    return await this.addressService.update(addressDTO, req.user?.login);
  }

  @Put('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Update address with id' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: AddressDTO,
  })
  async putId(@Req() req: Request, @Body() addressDTO: AddressDTO): Promise<AddressDTO> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Address', addressDTO.id);
    return await this.addressService.update(addressDTO, req.user?.login);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ summary: 'Delete address' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Address', id);
    return await this.addressService.deleteById(id);
  }
}
