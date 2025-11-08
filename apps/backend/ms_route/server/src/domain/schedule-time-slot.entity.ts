/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Schedule } from './schedule.entity';

/**
 * A ScheduleTimeSlot.
 */
@Entity('schedule_time_slot')
export class ScheduleTimeSlot extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'slot_code', unique: true })
  slotCode: string;

  @Column({ name: 'departure_time' })
  departureTime: any;

  @Column({ name: 'arrival_time' })
  arrivalTime: any;

  @Column({ type: 'integer', name: 'buffer_minutes', nullable: true })
  bufferMinutes?: number;

  @Column({ type: 'integer', name: 'sequence', nullable: true })
  sequence?: number;

  @Column({ type: 'boolean', name: 'active' })
  active: boolean;

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

  @ManyToOne(type => Schedule)
  schedule?: Schedule;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
