/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Profile } from './profile.entity';

/**
 * A AppUser.
 */
@Entity('app_user')
export class AppUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'keycloak_id', unique: true })
  keycloakId: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber?: string;

  @Column({ name: 'first_name', nullable: true })
  firstName?: string;

  @Column({ name: 'last_name', nullable: true })
  lastName?: string;

  @Column({ type: 'date', name: 'date_of_birth', nullable: true })
  dateOfBirth?: any;

  @Column({ type: 'boolean', name: 'is_verified', nullable: true })
  isVerified?: boolean;

  @Column({ type: 'boolean', name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'timestamp', name: 'last_login_at', nullable: true })
  lastLoginAt?: any;

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

  @OneToOne(type => Profile)
  @JoinColumn()
  profile?: Profile;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
