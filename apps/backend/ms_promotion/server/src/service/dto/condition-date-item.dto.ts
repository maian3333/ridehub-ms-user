/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from './base.dto';

import { ConditionByDateDTO } from './condition-by-date.dto';

/**
 * A ConditionDateItemDTO object.
 */
export class ConditionDateItemDTO extends BaseDTO {
  id?: number;

  @ApiProperty({ description: 'specificDate field', required: false })
  specificDate?: any;

  @ApiProperty({ description: 'weekday field', required: false })
  weekday?: number;

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

  @ApiProperty({ type: () => ConditionByDateDTO, description: 'condition relationship' })
  condition?: ConditionByDateDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
