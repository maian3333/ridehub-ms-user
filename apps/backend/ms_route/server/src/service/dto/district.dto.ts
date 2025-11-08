/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from './base.dto';

import { WardDTO } from './ward.dto';
import { ProvinceDTO } from './province.dto';

/**
 * A DistrictDTO object.
 */
export class DistrictDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'districtCode field' })
  districtCode: string;

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

  @ApiProperty({ type: () => WardDTO, isArray: true, description: 'wards relationship' })
  wards?: WardDTO[];
  @ApiProperty({ type: () => ProvinceDTO, description: 'province relationship' })
  province?: ProvinceDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
