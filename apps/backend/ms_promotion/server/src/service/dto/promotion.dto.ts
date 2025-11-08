/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from './base.dto';

import { FilePromotionDTO } from './file-promotion.dto';
import { BuyNGetMFreeDTO } from './buy-n-get-m-free.dto';
import { PercentOffTotalDTO } from './percent-off-total.dto';
import { ConditionByRouteDTO } from './condition-by-route.dto';
import { ConditionByDateDTO } from './condition-by-date.dto';
import { ConditionByLocationDTO } from './condition-by-location.dto';

/**
 * A PromotionDTO object.
 */
export class PromotionDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'code field' })
  code: string;

  @ApiProperty({ description: 'description field', required: false })
  description?: string;

  @ApiProperty({ description: 'startDate field', required: false })
  startDate?: any;

  @ApiProperty({ description: 'endDate field', required: false })
  endDate?: any;

  @ApiProperty({ description: 'usageLimit field', required: false })
  usageLimit?: number;

  @ApiProperty({ description: 'usedCount field', required: false })
  usedCount?: number;

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

  @ApiProperty({ type: () => FilePromotionDTO, isArray: true, description: 'files relationship' })
  files?: FilePromotionDTO[];
  @ApiProperty({ type: () => BuyNGetMFreeDTO, isArray: true, description: 'buyNGetMS relationship' })
  buyNGetMS?: BuyNGetMFreeDTO[];
  @ApiProperty({ type: () => PercentOffTotalDTO, isArray: true, description: 'percentOffs relationship' })
  percentOffs?: PercentOffTotalDTO[];
  @ApiProperty({ type: () => ConditionByRouteDTO, isArray: true, description: 'conditionsRS relationship' })
  conditionsRS?: ConditionByRouteDTO[];
  @ApiProperty({ type: () => ConditionByDateDTO, isArray: true, description: 'conditionsDS relationship' })
  conditionsDS?: ConditionByDateDTO[];
  @ApiProperty({ type: () => ConditionByLocationDTO, isArray: true, description: 'conditionsLocs relationship' })
  conditionsLocs?: ConditionByLocationDTO[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
