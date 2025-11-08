/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Booking } from './booking.entity';

/**
 * A AppliedPromotion.
 */
@Entity('applied_promotion')
export class AppliedPromotion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'long', name: 'promotion_id' })
  promotionId: number;

  @Column({ name: 'promotion_code', nullable: true })
  promotionCode?: string;

  @Column({ name: 'policy_type', nullable: true })
  policyType?: string;

  @Column({ type: 'integer', name: 'percent', nullable: true })
  percent?: number;

  @Column({ type: 'decimal', name: 'max_off', precision: 10, scale: 2, nullable: true })
  maxOff?: number;

  @Column({ type: 'decimal', name: 'discount_amount', precision: 10, scale: 2 })
  discountAmount: number;

  @Column({ type: 'timestamp', name: 'applied_at' })
  appliedAt: any;

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

  @ManyToOne(type => Booking)
  booking?: Booking;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
