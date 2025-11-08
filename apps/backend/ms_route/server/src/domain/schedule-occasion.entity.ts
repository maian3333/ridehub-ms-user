/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Schedule } from './schedule.entity';
import { OccasionType } from './enumeration/occasion-type';

/**
 * A ScheduleOccasion.
 */
@Entity('schedule_occasion')
export class ScheduleOccasion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'simple-enum', name: 'occasion', enum: OccasionType })
  occasion: OccasionType;

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

  @OneToMany(type => Schedule, other => other.occasionRule)
  schedules?: Schedule[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
