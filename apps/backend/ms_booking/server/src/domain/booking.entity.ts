/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Invoice } from './invoice.entity';
import { PaymentTransaction } from './payment-transaction.entity';
import { Ticket } from './ticket.entity';
import { AppliedPromotion } from './applied-promotion.entity';
import { PricingSnapshot } from './pricing-snapshot.entity';
import { BookingStatus } from './enumeration/booking-status';

/**
 * A Booking.
 */
@Entity('booking')
export class Booking extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'booking_code', unique: true })
  bookingCode: string;

  @Column({ type: 'simple-enum', name: 'status', enum: BookingStatus })
  status: BookingStatus;

  @Column({ type: 'integer', name: 'quantity', nullable: true })
  quantity?: number;

  @Column({ type: 'decimal', name: 'total_amount', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'timestamp', name: 'booked_at' })
  bookedAt: any;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'idempotency_key', length: 80, nullable: true })
  idempotencyKey?: string;

  @Column({ type: 'long', name: 'trip_id' })
  tripId: number;

  @Column({ name: 'lock_group_id', length: 36, nullable: true })
  lockGroupId?: string;

  @Column({ type: 'timestamp', name: 'expires_at', nullable: true })
  expiresAt?: any;

  @Column({ type: 'integer', name: 'timeout_minutes', nullable: true })
  timeoutMinutes?: number;

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

  @OneToOne(type => Invoice)
  @JoinColumn()
  invoice?: Invoice;

  @OneToOne(type => PaymentTransaction)
  @JoinColumn()
  paymentTransaction?: PaymentTransaction;

  @OneToMany(type => Ticket, other => other.booking)
  tickets?: Ticket[];

  @OneToMany(type => AppliedPromotion, other => other.booking)
  appliedPromos?: AppliedPromotion[];

  @OneToMany(type => PricingSnapshot, other => other.booking)
  pricingSnapshots?: PricingSnapshot[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
