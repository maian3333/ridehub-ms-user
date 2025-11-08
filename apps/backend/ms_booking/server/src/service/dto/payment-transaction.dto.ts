/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { PaymentMethod } from '../../domain/enumeration/payment-method';
import { PaymentStatus } from '../../domain/enumeration/payment-status';
import { BaseDTO } from './base.dto';

import { PaymentWebhookLogDTO } from './payment-webhook-log.dto';
import { BookingDTO } from './booking.dto';

/**
 * A PaymentTransactionDTO object.
 */
export class PaymentTransactionDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @MaxLength(80)
  @ApiProperty({ description: 'transactionId field' })
  transactionId: string;

  @MaxLength(80)
  @ApiProperty({ description: 'orderRef field', required: false })
  orderRef?: string;

  @ApiProperty({ enum: PaymentMethod, description: 'method enum field', required: false })
  method?: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus, description: 'status enum field', required: false })
  status?: PaymentStatus;

  @ApiProperty({ description: 'amount field', required: false })
  amount?: number;

  @ApiProperty({ description: 'time field', required: false })
  time?: any;

  @MaxLength(14)
  @ApiProperty({ description: 'gatewayCreateDate field', required: false })
  gatewayCreateDate?: string;

  @MaxLength(1024)
  @ApiProperty({ description: 'gatewayNote field', required: false })
  gatewayNote?: string;

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

  @ApiProperty({ type: () => PaymentWebhookLogDTO, isArray: true, description: 'webhooks relationship' })
  webhooks?: PaymentWebhookLogDTO[];
  @ApiProperty({ type: () => BookingDTO, description: 'booking relationship' })
  booking?: BookingDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
