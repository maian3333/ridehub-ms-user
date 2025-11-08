/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { BaseDTO } from './base.dto';

import { AddressDTO } from './address.dto';
import { FileRouteDTO } from './file-route.dto';

/**
 * A StationDTO object.
 */
export class StationDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @MaxLength(200)
  @ApiProperty({ description: 'name field' })
  name: string;

  @MaxLength(32)
  @ApiProperty({ description: 'phoneNumber field', required: false })
  phoneNumber?: string;

  @MaxLength(1024)
  @ApiProperty({ description: 'description field', required: false })
  description?: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'active field' })
  active: boolean;

  @IsNotEmpty()
  @ApiProperty({ description: 'createdAt field' })
  createdAt: any;

  @ApiProperty({ description: 'updatedAt field', required: false })
  updatedAt?: any;

  @ApiProperty({ description: 'isDeleted field', required: false })
  isDeleted?: boolean;

  @ApiProperty({ description: 'deletedAt field', required: false })
  deletedAt?: any;

  @ApiProperty({ description: 'deletedBy field', required: false })
  deletedBy?: string;

  @ApiProperty({ type: () => AddressDTO, description: 'address relationship' })
  address?: AddressDTO;
  @ApiProperty({ type: () => FileRouteDTO, description: 'stationImg relationship' })
  stationImg?: FileRouteDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
