/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { SeatType } from '../../domain/enumeration/seat-type';
import { BaseDTO } from './base.dto';

import { FloorDTO } from './floor.dto';

/**
 * A SeatDTO object.
 */
export class SeatDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @MaxLength(16)
  @ApiProperty({ description: 'seatNo field' })
  seatNo: string;

  @ApiProperty({ description: 'rowNo field', required: false })
  rowNo?: number;

  @ApiProperty({ description: 'colNo field', required: false })
  colNo?: number;

  @ApiProperty({ description: 'priceFactor field', required: false })
  priceFactor?: number;

  @ApiProperty({ enum: SeatType, description: 'type enum field', required: false })
  type?: SeatType;

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

  @ApiProperty({ type: () => FloorDTO, description: 'floor relationship' })
  floor?: FloorDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
