/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { FileBooking } from './file-booking.entity';
import { Booking } from './booking.entity';
import { AvroTicketStatus } from './enumeration/avro-ticket-status';
import { ExchangeStatus } from './enumeration/exchange-status';
import { RefundStatus } from './enumeration/refund-status';

/**
 * A Ticket.
 */
@Entity('ticket')
export class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'ticket_code', length: 40, unique: true })
  ticketCode: string;

  @Column({ type: 'decimal', name: 'price', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'qr_code', length: 256, nullable: true })
  qrCode?: string;

  @Column({ type: 'timestamp', name: 'time_from', nullable: true })
  timeFrom?: any;

  @Column({ type: 'timestamp', name: 'time_to', nullable: true })
  timeTo?: any;

  @Column({ type: 'boolean', name: 'checked_in', nullable: true })
  checkedIn?: boolean;

  @Column({ type: 'simple-enum', name: 'status', enum: AvroTicketStatus })
  status: AvroTicketStatus;

  @Column({ type: 'simple-enum', name: 'exchange_status', enum: ExchangeStatus })
  exchangeStatus?: ExchangeStatus;

  @Column({ type: 'simple-enum', name: 'refund_status', enum: RefundStatus })
  refundStatus?: RefundStatus;

  @Column({ name: 'exchange_reason', nullable: true })
  exchangeReason?: string;

  @Column({ name: 'refund_reason', nullable: true })
  refundReason?: string;

  @Column({ type: 'timestamp', name: 'exchange_requested_at', nullable: true })
  exchangeRequestedAt?: any;

  @Column({ type: 'timestamp', name: 'exchange_completed_at', nullable: true })
  exchangeCompletedAt?: any;

  @Column({ type: 'timestamp', name: 'refund_requested_at', nullable: true })
  refundRequestedAt?: any;

  @Column({ type: 'timestamp', name: 'refund_completed_at', nullable: true })
  refundCompletedAt?: any;

  @Column({ type: 'decimal', name: 'refund_amount', precision: 10, scale: 2, nullable: true })
  refundAmount?: number;

  @Column({ name: 'refund_transaction_id', length: 80, nullable: true })
  refundTransactionId?: string;

  @Column({ type: 'long', name: 'trip_id' })
  tripId: number;

  @Column({ type: 'long', name: 'route_id' })
  routeId: number;

  @Column({ type: 'long', name: 'seat_id' })
  seatId: number;

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt: any;

  @Column({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt?: any;

  @Column({ type: 'boolean', name: 'is_deleted', nullable: true })
  isDeleted?: boolean;

  @Column({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt?: any;

  @Column({ name: 'deleted_by', nullable: true })
  deletedBy?: string;

  @OneToOne(type => FileBooking)
  @JoinColumn()
  qrCodeImg?: FileBooking;

  @ManyToOne(type => Ticket)
  originalTicket?: Ticket;

  @ManyToOne(type => Ticket)
  exchangedTicket?: Ticket;

  @ManyToOne(type => Booking)
  booking?: Booking;

  @OneToMany(type => Ticket, other => other.originalTicket)
  exchangedFroms?: Ticket[];

  @OneToMany(type => Ticket, other => other.exchangedTicket)
  exchangedTos?: Ticket[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
