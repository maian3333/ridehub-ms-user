/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, Min } from 'class-validator';
import { BaseDTO } from './base.dto';

import { PromotionDTO } from './promotion.dto';

/**
 * A PercentOffTotalDTO object.
 */
export class PercentOffTotalDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @Min(1)
  @Max(100)
  @ApiProperty({ description: 'percent field' })
  percent: number;

  @ApiProperty({ description: 'maxOff field', required: false })
  maxOff?: number;

  @ApiProperty({ description: 'minPrice field', required: false })
  minPrice?: number;

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

  @ApiProperty({ type: () => PromotionDTO, description: 'promotion relationship' })
  promotion?: PromotionDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
