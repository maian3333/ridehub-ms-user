/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { AvroTicketStatus } from '../../domain/enumeration/avro-ticket-status';
import { ExchangeStatus } from '../../domain/enumeration/exchange-status';
import { RefundStatus } from '../../domain/enumeration/refund-status';
import { BaseDTO } from './base.dto';

import { FileBookingDTO } from './file-booking.dto';
import { BookingDTO } from './booking.dto';

/**
 * A TicketDTO object.
 */
export class TicketDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @MaxLength(40)
  @ApiProperty({ description: 'ticketCode field' })
  ticketCode: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'price field' })
  price: number;

  @MaxLength(256)
  @ApiProperty({ description: 'qrCode field', required: false })
  qrCode?: string;

  @ApiProperty({ description: 'timeFrom field', required: false })
  timeFrom?: any;

  @ApiProperty({ description: 'timeTo field', required: false })
  timeTo?: any;

  @ApiProperty({ description: 'checkedIn field', required: false })
  checkedIn?: boolean;

  @IsNotEmpty()
  @ApiProperty({ enum: AvroTicketStatus, description: 'status enum field' })
  status: AvroTicketStatus;

  @ApiProperty({ enum: ExchangeStatus, description: 'exchangeStatus enum field', required: false })
  exchangeStatus?: ExchangeStatus;

  @ApiProperty({ enum: RefundStatus, description: 'refundStatus enum field', required: false })
  refundStatus?: RefundStatus;

  @ApiProperty({ description: 'exchangeReason field', required: false })
  exchangeReason?: string;

  @ApiProperty({ description: 'refundReason field', required: false })
  refundReason?: string;

  @ApiProperty({ description: 'exchangeRequestedAt field', required: false })
  exchangeRequestedAt?: any;

  @ApiProperty({ description: 'exchangeCompletedAt field', required: false })
  exchangeCompletedAt?: any;

  @ApiProperty({ description: 'refundRequestedAt field', required: false })
  refundRequestedAt?: any;

  @ApiProperty({ description: 'refundCompletedAt field', required: false })
  refundCompletedAt?: any;

  @ApiProperty({ description: 'refundAmount field', required: false })
  refundAmount?: number;

  @MaxLength(80)
  @ApiProperty({ description: 'refundTransactionId field', required: false })
  refundTransactionId?: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'tripId field' })
  tripId: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'routeId field' })
  routeId: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'seatId field' })
  seatId: number;

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

  @ApiProperty({ type: () => FileBookingDTO, description: 'qrCodeImg relationship' })
  qrCodeImg?: FileBookingDTO;
  @ApiProperty({ type: () => TicketDTO, description: 'originalTicket relationship' })
  originalTicket?: TicketDTO;
  @ApiProperty({ type: () => TicketDTO, description: 'exchangedTicket relationship' })
  exchangedTicket?: TicketDTO;
  @ApiProperty({ type: () => BookingDTO, description: 'booking relationship' })
  booking?: BookingDTO;
  @ApiProperty({ type: () => TicketDTO, isArray: true, description: 'exchangedFroms relationship' })
  exchangedFroms?: TicketDTO[];
  @ApiProperty({ type: () => TicketDTO, isArray: true, description: 'exchangedTos relationship' })
  exchangedTos?: TicketDTO[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
