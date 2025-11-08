/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { SeatMap } from './seat-map.entity';
import { FileRoute } from './file-route.entity';
import { VehicleType } from './enumeration/vehicle-type';
import { VehicleStatus } from './enumeration/vehicle-status';

/**
 * A Vehicle.
 */
@Entity('vehicle')
export class Vehicle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'simple-enum', name: 'type', enum: VehicleType })
  type: VehicleType;

  @Column({ type: 'decimal', name: 'type_factor', precision: 10, scale: 2, nullable: true })
  typeFactor?: number;

  @Column({ name: 'plate_number', unique: true })
  plateNumber: string;

  @Column({ name: 'brand', nullable: true })
  brand?: string;

  @Column({ name: 'description', nullable: true })
  description?: string;

  @Column({ type: 'simple-enum', name: 'status', enum: VehicleStatus })
  status: VehicleStatus;

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

  @ManyToOne(type => FileRoute)
  vehicleImg?: FileRoute;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
