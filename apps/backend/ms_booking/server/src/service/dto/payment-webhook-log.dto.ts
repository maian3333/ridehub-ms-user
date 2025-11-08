/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { BaseDTO } from './base.dto';

import { PaymentTransactionDTO } from './payment-transaction.dto';

/**
 * A PaymentWebhookLogDTO object.
 */
export class PaymentWebhookLogDTO extends BaseDTO {
  id?: number;

  @ApiProperty({ description: 'provider field', required: false })
  provider?: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'payloadHash field' })
  payloadHash: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'receivedAt field' })
  receivedAt: any;

  @MaxLength(64)
  @ApiProperty({ description: 'processingStatus field', required: false })
  processingStatus?: string;

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

  @ApiProperty({ type: () => PaymentTransactionDTO, description: 'paymentTransaction relationship' })
  paymentTransaction?: PaymentTransactionDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
