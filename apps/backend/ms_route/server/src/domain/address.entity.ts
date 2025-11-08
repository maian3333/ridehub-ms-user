/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Station } from './station.entity';
import { Ward } from './ward.entity';

/**
 * A Address.
 */
@Entity('address')
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'street_address' })
  streetAddress: string;

  @Column({ type: 'decimal', name: 'latitude', precision: 10, scale: 2, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', name: 'longitude', precision: 10, scale: 2, nullable: true })
  longitude?: number;

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

  @OneToOne(type => Station)
  station?: Station;

  @ManyToOne(type => Ward)
  ward?: Ward;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
