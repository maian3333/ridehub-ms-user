/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { LockStatus } from '../../domain/enumeration/lock-status';
import { BaseDTO } from './base.dto';

import { TripDTO } from './trip.dto';

/**
 * A SeatLockDTO object.
 */
export class SeatLockDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @MaxLength(16)
  @ApiProperty({ description: 'seatNo field' })
  seatNo: string;

  @ApiProperty({ description: 'userId field', required: false })
  userId?: number;

  @IsNotEmpty()
  @ApiProperty({ enum: LockStatus, description: 'status enum field' })
  status: LockStatus;

  @IsNotEmpty()
  @ApiProperty({ description: 'expiresAt field' })
  expiresAt: any;

  @MaxLength(80)
  @ApiProperty({ description: 'idempotencyKey field', required: false })
  idempotencyKey?: string;

  @ApiProperty({ description: 'bookingId field', required: false })
  bookingId?: number;

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

  @ApiProperty({ type: () => TripDTO, description: 'trip relationship' })
  trip?: TripDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
