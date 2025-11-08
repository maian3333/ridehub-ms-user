/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { BookingStatus } from '../../domain/enumeration/booking-status';
import { BaseDTO } from './base.dto';

import { InvoiceDTO } from './invoice.dto';
import { PaymentTransactionDTO } from './payment-transaction.dto';
import { TicketDTO } from './ticket.dto';
import { AppliedPromotionDTO } from './applied-promotion.dto';
import { PricingSnapshotDTO } from './pricing-snapshot.dto';

/**
 * A BookingDTO object.
 */
export class BookingDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'bookingCode field' })
  bookingCode: string;

  @IsNotEmpty()
  @ApiProperty({ enum: BookingStatus, description: 'status enum field' })
  status: BookingStatus;

  @ApiProperty({ description: 'quantity field', required: false })
  quantity?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'totalAmount field' })
  totalAmount: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'bookedAt field' })
  bookedAt: any;

  @IsNotEmpty()
  @ApiProperty({ description: 'customerId field' })
  customerId: string;

  @MaxLength(80)
  @ApiProperty({ description: 'idempotencyKey field', required: false })
  idempotencyKey?: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'tripId field' })
  tripId: number;

  @MaxLength(36)
  @ApiProperty({ description: 'lockGroupId field', required: false })
  lockGroupId?: string;

  @ApiProperty({ description: 'expiresAt field', required: false })
  expiresAt?: any;

  @ApiProperty({ description: 'timeoutMinutes field', required: false })
  timeoutMinutes?: number;

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

  @ApiProperty({ type: () => InvoiceDTO, description: 'invoice relationship' })
  invoice?: InvoiceDTO;
  @ApiProperty({ type: () => PaymentTransactionDTO, description: 'paymentTransaction relationship' })
  paymentTransaction?: PaymentTransactionDTO;
  @ApiProperty({ type: () => TicketDTO, isArray: true, description: 'tickets relationship' })
  tickets?: TicketDTO[];
  @ApiProperty({ type: () => AppliedPromotionDTO, isArray: true, description: 'appliedPromos relationship' })
  appliedPromos?: AppliedPromotionDTO[];
  @ApiProperty({ type: () => PricingSnapshotDTO, isArray: true, description: 'pricingSnapshots relationship' })
  pricingSnapshots?: PricingSnapshotDTO[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
