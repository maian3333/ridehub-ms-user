/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from './base.dto';

import { AddressDTO } from './address.dto';
import { DistrictDTO } from './district.dto';

/**
 * A WardDTO object.
 */
export class WardDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'wardCode field' })
  wardCode: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'name field' })
  name: string;

  @ApiProperty({ description: 'nameEn field', required: false })
  nameEn?: string;

  @ApiProperty({ description: 'fullName field', required: false })
  fullName?: string;

  @ApiProperty({ description: 'fullNameEn field', required: false })
  fullNameEn?: string;

  @ApiProperty({ description: 'codeName field', required: false })
  codeName?: string;

  @ApiProperty({ description: 'administrativeUnitId field', required: false })
  administrativeUnitId?: number;

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

  @ApiProperty({ type: () => AddressDTO, isArray: true, description: 'addresses relationship' })
  addresses?: AddressDTO[];
  @ApiProperty({ type: () => DistrictDTO, description: 'district relationship' })
  district?: DistrictDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
