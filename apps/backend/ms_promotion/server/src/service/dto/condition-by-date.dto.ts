/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from './base.dto';

import { ConditionDateItemDTO } from './condition-date-item.dto';
import { PromotionDTO } from './promotion.dto';

/**
 * A ConditionByDateDTO object.
 */
export class ConditionByDateDTO extends BaseDTO {
  id?: number;

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

  @ApiProperty({ type: () => ConditionDateItemDTO, isArray: true, description: 'items relationship' })
  items?: ConditionDateItemDTO[];
  @ApiProperty({ type: () => PromotionDTO, description: 'promotion relationship' })
  promotion?: PromotionDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
