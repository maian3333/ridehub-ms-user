/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { FileUser } from './file-user.entity';
import { AppUser } from './app-user.entity';

/**
 * A Profile.
 */
@Entity('profile')
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'full_name', nullable: true })
  fullName?: string;

  @Column({ type: 'date', name: 'birth_date', nullable: true })
  birthDate?: any;

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

  @OneToOne(type => FileUser)
  @JoinColumn()
  avatar?: FileUser;

  @OneToOne(type => AppUser)
  user?: AppUser;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
