/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Route } from './route.entity';
import { Vehicle } from './vehicle.entity';
import { ScheduleTimeSlot } from './schedule-time-slot.entity';
import { Driver } from './driver.entity';
import { Attendant } from './attendant.entity';

/**
 * A Trip.
 */
@Entity('trip')
export class Trip extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'trip_code', unique: true })
  tripCode: string;

  @Column({ type: 'timestamp', name: 'departure_time' })
  departureTime: any;

  @Column({ type: 'timestamp', name: 'arrival_time' })
  arrivalTime: any;

  @Column({ type: 'decimal', name: 'occasion_factor', precision: 10, scale: 2 })
  occasionFactor: number;

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

  @ManyToOne(type => Route)
  route?: Route;

  @ManyToOne(type => Vehicle)
  vehicle?: Vehicle;

  @ManyToOne(type => ScheduleTimeSlot)
  slot?: ScheduleTimeSlot;

  @ManyToOne(type => Driver)
  driver?: Driver;

  @ManyToOne(type => Attendant)
  attendant?: Attendant;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
