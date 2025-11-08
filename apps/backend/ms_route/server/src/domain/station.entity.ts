/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Address } from './address.entity';
import { FileRoute } from './file-route.entity';

/**
 * A Station.
 */
@Entity('station')
export class Station extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'name', length: 200 })
  name: string;

  @Column({ name: 'phone_number', length: 32, nullable: true })
  phoneNumber?: string;

  @Column({ name: 'description', length: 1024, nullable: true })
  description?: string;

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

  @OneToOne(type => Address)
  @JoinColumn()
  address?: Address;

  @ManyToOne(type => FileRoute)
  stationImg?: FileRoute;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
