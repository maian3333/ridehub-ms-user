/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Floor } from './floor.entity';
import { SeatType } from './enumeration/seat-type';

/**
 * A Seat.
 */
@Entity('seat')
export class Seat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'seat_no', length: 16 })
  seatNo: string;

  @Column({ type: 'integer', name: 'row_no', nullable: true })
  rowNo?: number;

  @Column({ type: 'integer', name: 'col_no', nullable: true })
  colNo?: number;

  @Column({ type: 'decimal', name: 'price_factor', precision: 10, scale: 2, nullable: true })
  priceFactor?: number;

  @Column({ type: 'simple-enum', name: 'type', enum: SeatType })
  type?: SeatType;

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

  @ManyToOne(type => Floor)
  floor?: Floor;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
