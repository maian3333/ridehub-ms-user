/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from './base.dto';

import { StationDTO } from './station.dto';
import { WardDTO } from './ward.dto';

/**
 * A AddressDTO object.
 */
export class AddressDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'streetAddress field' })
  streetAddress: string;

  @ApiProperty({ description: 'latitude field', required: false })
  latitude?: number;

  @ApiProperty({ description: 'longitude field', required: false })
  longitude?: number;

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

  @ApiProperty({ type: () => StationDTO, description: 'station relationship' })
  station?: StationDTO;
  @ApiProperty({ type: () => WardDTO, description: 'ward relationship' })
  ward?: WardDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
