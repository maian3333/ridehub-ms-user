/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Trip } from './trip.entity';
import { LockStatus } from './enumeration/lock-status';

/**
 * A SeatLock.
 */
@Entity('seat_lock')
export class SeatLock extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'seat_no', length: 16 })
  seatNo: string;

  @Column({ type: 'long', name: 'user_id', nullable: true })
  userId?: number;

  @Column({ type: 'simple-enum', name: 'status', enum: LockStatus })
  status: LockStatus;

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt: any;

  @Column({ name: 'idempotency_key', length: 80, nullable: true, unique: true })
  idempotencyKey?: string;

  @Column({ type: 'long', name: 'booking_id', nullable: true })
  bookingId?: number;

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

  @ManyToOne(type => Trip)
  trip?: Trip;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
