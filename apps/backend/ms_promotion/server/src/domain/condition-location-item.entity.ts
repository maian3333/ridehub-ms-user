/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { ConditionByLocation } from './condition-by-location.entity';

/**
 * A ConditionLocationItem.
 */
@Entity('condition_location_item')
export class ConditionLocationItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'long', name: 'province_id', nullable: true })
  provinceId?: number;

  @Column({ type: 'long', name: 'district_id', nullable: true })
  districtId?: number;

  @Column({ type: 'long', name: 'ward_id', nullable: true })
  wardId?: number;

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

  @ManyToOne(type => ConditionByLocation)
  condition?: ConditionByLocation;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
