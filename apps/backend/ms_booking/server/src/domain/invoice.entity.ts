/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Booking } from './booking.entity';

/**
 * A Invoice.
 */
@Entity('invoice')
export class Invoice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'invoice_no', unique: true })
  invoiceNo: string;

  @Column({ type: 'timestamp', name: 'issued_at', nullable: true })
  issuedAt?: any;

  @Column({ type: 'decimal', name: 'gross_amount', precision: 10, scale: 2, nullable: true })
  grossAmount?: number;

  @Column({ type: 'decimal', name: 'vat_amount', precision: 10, scale: 2, nullable: true })
  vatAmount?: number;

  @Column({ type: 'decimal', name: 'net_amount', precision: 10, scale: 2, nullable: true })
  netAmount?: number;

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

  @OneToOne(type => Booking)
  booking?: Booking;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
