/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { PaymentTransaction } from './payment-transaction.entity';

/**
 * A PaymentWebhookLog.
 */
@Entity('payment_webhook_log')
export class PaymentWebhookLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'provider', nullable: true })
  provider?: string;

  @Column({ name: 'payload_hash', unique: true })
  payloadHash: string;

  @Column({ type: 'timestamp', name: 'received_at' })
  receivedAt: any;

  @Column({ name: 'processing_status', length: 64, nullable: true })
  processingStatus?: string;

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

  @ManyToOne(type => PaymentTransaction)
  paymentTransaction?: PaymentTransaction;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
