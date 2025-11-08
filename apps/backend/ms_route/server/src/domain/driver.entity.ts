/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Staff } from './staff.entity';

/**
 * A Driver.
 */
@Entity('driver')
export class Driver extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'license_class', nullable: true })
  licenseClass?: string;

  @Column({ type: 'integer', name: 'years_experience', nullable: true })
  yearsExperience?: number;

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

  @OneToOne(type => Staff)
  @JoinColumn()
  staff?: Staff;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
