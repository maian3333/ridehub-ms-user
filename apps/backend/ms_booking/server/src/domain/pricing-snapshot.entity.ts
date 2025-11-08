/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Booking } from './booking.entity';

/**
 * A PricingSnapshot.
 */
@Entity('pricing_snapshot')
export class PricingSnapshot extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'decimal', name: 'base_fare', precision: 10, scale: 2 })
  baseFare: number;

  @Column({ type: 'decimal', name: 'vehicle_factor', precision: 10, scale: 2, nullable: true })
  vehicleFactor?: number;

  @Column({ type: 'decimal', name: 'floor_factor', precision: 10, scale: 2, nullable: true })
  floorFactor?: number;

  @Column({ type: 'decimal', name: 'seat_factor', precision: 10, scale: 2, nullable: true })
  seatFactor?: number;

  @Column({ type: 'decimal', name: 'schedule_occasion_factor', precision: 10, scale: 2, nullable: true })
  scheduleOccasionFactor?: number;

  @Column({ type: 'decimal', name: 'final_price', precision: 10, scale: 2 })
  finalPrice: number;

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
