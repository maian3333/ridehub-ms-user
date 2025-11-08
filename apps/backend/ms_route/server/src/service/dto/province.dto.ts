/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from './base.dto';

import { DistrictDTO } from './district.dto';

/**
 * A ProvinceDTO object.
 */
export class ProvinceDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'provinceCode field' })
  provinceCode: string;

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

  @ApiProperty({ description: 'administrativeRegionId field', required: false })
  administrativeRegionId?: number;

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

  @ApiProperty({ type: () => DistrictDTO, isArray: true, description: 'districts relationship' })
  districts?: DistrictDTO[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
