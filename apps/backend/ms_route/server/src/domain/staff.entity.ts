/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Driver } from './driver.entity';
import { Attendant } from './attendant.entity';
import { Gender } from './enumeration/gender';
import { StaffStatus } from './enumeration/staff-status';

/**
 * A Staff.
 */
@Entity('staff')
export class Staff extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ type: 'integer', name: 'age', nullable: true })
  age?: number;

  @Column({ type: 'simple-enum', name: 'gender', enum: Gender })
  gender?: Gender;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber?: string;

  @Column({ type: 'simple-enum', name: 'status', enum: StaffStatus })
  status?: StaffStatus;

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

  @OneToOne(type => Driver)
  driver?: Driver;

  @OneToOne(type => Attendant)
  attendant?: Attendant;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
