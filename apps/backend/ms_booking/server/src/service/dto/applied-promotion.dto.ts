/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from './base.dto';

import { BookingDTO } from './booking.dto';

/**
 * A AppliedPromotionDTO object.
 */
export class AppliedPromotionDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'promotionId field' })
  promotionId: number;

  @ApiProperty({ description: 'promotionCode field', required: false })
  promotionCode?: string;

  @ApiProperty({ description: 'policyType field', required: false })
  policyType?: string;

  @ApiProperty({ description: 'percent field', required: false })
  percent?: number;

  @ApiProperty({ description: 'maxOff field', required: false })
  maxOff?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'discountAmount field' })
  discountAmount: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'appliedAt field' })
  appliedAt: any;

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

  @ApiProperty({ type: () => BookingDTO, description: 'booking relationship' })
  booking?: BookingDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
