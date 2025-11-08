/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { SeatMap } from './seat-map.entity';

/**
 * A Floor.
 */
@Entity('floor')
export class Floor extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'integer', name: 'floor_no' })
  floorNo: number;

  @Column({ type: 'decimal', name: 'price_factor_floor', precision: 10, scale: 2, nullable: true })
  priceFactorFloor?: number;

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

  @ManyToOne(type => SeatMap)
  seatMap?: SeatMap;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
