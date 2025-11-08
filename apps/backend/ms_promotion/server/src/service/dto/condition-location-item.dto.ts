/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from './base.dto';

import { ConditionByLocationDTO } from './condition-by-location.dto';

/**
 * A ConditionLocationItemDTO object.
 */
export class ConditionLocationItemDTO extends BaseDTO {
  id?: number;

  @ApiProperty({ description: 'provinceId field', required: false })
  provinceId?: number;

  @ApiProperty({ description: 'districtId field', required: false })
  districtId?: number;

  @ApiProperty({ description: 'wardId field', required: false })
  wardId?: number;

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

  @ApiProperty({ type: () => ConditionByLocationDTO, description: 'condition relationship' })
  condition?: ConditionByLocationDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
