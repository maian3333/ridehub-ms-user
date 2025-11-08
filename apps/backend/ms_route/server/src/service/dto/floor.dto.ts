/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from './base.dto';

import { SeatMapDTO } from './seat-map.dto';

/**
 * A FloorDTO object.
 */
export class FloorDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'floorNo field' })
  floorNo: number;

  @ApiProperty({ description: 'priceFactorFloor field', required: false })
  priceFactorFloor?: number;

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

  @ApiProperty({ type: () => SeatMapDTO, description: 'seatMap relationship' })
  seatMap?: SeatMapDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
