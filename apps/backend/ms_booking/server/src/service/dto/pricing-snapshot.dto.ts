/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from './base.dto';

import { BookingDTO } from './booking.dto';

/**
 * A PricingSnapshotDTO object.
 */
export class PricingSnapshotDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'baseFare field' })
  baseFare: number;

  @ApiProperty({ description: 'vehicleFactor field', required: false })
  vehicleFactor?: number;

  @ApiProperty({ description: 'floorFactor field', required: false })
  floorFactor?: number;

  @ApiProperty({ description: 'seatFactor field', required: false })
  seatFactor?: number;

  @ApiProperty({ description: 'scheduleOccasionFactor field', required: false })
  scheduleOccasionFactor?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'finalPrice field' })
  finalPrice: number;

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
