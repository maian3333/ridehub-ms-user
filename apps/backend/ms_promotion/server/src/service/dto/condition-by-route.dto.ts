/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from './base.dto';

import { ConditionRouteItemDTO } from './condition-route-item.dto';
import { PromotionDTO } from './promotion.dto';

/**
 * A ConditionByRouteDTO object.
 */
export class ConditionByRouteDTO extends BaseDTO {
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

  @ApiProperty({ type: () => ConditionRouteItemDTO, isArray: true, description: 'items relationship' })
  items?: ConditionRouteItemDTO[];
  @ApiProperty({ type: () => PromotionDTO, description: 'promotion relationship' })
  promotion?: PromotionDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
