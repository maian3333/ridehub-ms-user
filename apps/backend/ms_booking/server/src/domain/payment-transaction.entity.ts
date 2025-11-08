/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { PaymentWebhookLog } from './payment-webhook-log.entity';
import { Booking } from './booking.entity';
import { PaymentMethod } from './enumeration/payment-method';
import { PaymentStatus } from './enumeration/payment-status';

/**
 * A PaymentTransaction.
 */
@Entity('payment_transaction')
export class PaymentTransaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'transaction_id', length: 80, unique: true })
  transactionId: string;

  @Column({ name: 'order_ref', length: 80, nullable: true })
  orderRef?: string;

  @Column({ type: 'simple-enum', name: 'method', enum: PaymentMethod })
  method?: PaymentMethod;

  @Column({ type: 'simple-enum', name: 'status', enum: PaymentStatus })
  status?: PaymentStatus;

  @Column({ type: 'decimal', name: 'amount', precision: 10, scale: 2, nullable: true })
  amount?: number;

  @Column({ type: 'timestamp', name: 'time', nullable: true })
  time?: any;

  @Column({ name: 'gateway_create_date', length: 14, nullable: true })
  gatewayCreateDate?: string;

  @Column({ name: 'gateway_note', length: 1024, nullable: true })
  gatewayNote?: string;

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

  @OneToMany(type => PaymentWebhookLog, other => other.paymentTransaction)
  webhooks?: PaymentWebhookLog[];

  @OneToOne(type => Booking)
  booking?: Booking;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
