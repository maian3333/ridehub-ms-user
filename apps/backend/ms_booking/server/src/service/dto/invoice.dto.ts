/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from './base.dto';

import { BookingDTO } from './booking.dto';

/**
 * A InvoiceDTO object.
 */
export class InvoiceDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'invoiceNo field' })
  invoiceNo: string;

  @ApiProperty({ description: 'issuedAt field', required: false })
  issuedAt?: any;

  @ApiProperty({ description: 'grossAmount field', required: false })
  grossAmount?: number;

  @ApiProperty({ description: 'vatAmount field', required: false })
  vatAmount?: number;

  @ApiProperty({ description: 'netAmount field', required: false })
  netAmount?: number;

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
