/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { ScheduleTimeSlot } from './schedule-time-slot.entity';
import { ScheduleOccasion } from './schedule-occasion.entity';
import { Route } from './route.entity';

/**
 * A Schedule.
 */
@Entity('schedule')
export class Schedule extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'schedule_code', unique: true })
  scheduleCode: string;

  @Column({ type: 'date', name: 'start_date', nullable: true })
  startDate?: any;

  @Column({ type: 'date', name: 'end_date', nullable: true })
  endDate?: any;

  @Column({ name: 'days_of_week', nullable: true })
  daysOfWeek?: string;

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

  @OneToMany(type => ScheduleTimeSlot, other => other.schedule)
  timeSlots?: ScheduleTimeSlot[];

  @ManyToOne(type => ScheduleOccasion)
  occasionRule?: ScheduleOccasion;

  @ManyToOne(type => Route)
  route?: Route;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
