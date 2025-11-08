/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { ConditionLocationItem } from './condition-location-item.entity';
import { Promotion } from './promotion.entity';

/**
 * A ConditionByLocation.
 */
@Entity('condition_by_location')
export class ConditionByLocation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

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

  @OneToMany(type => ConditionLocationItem, other => other.condition)
  items?: ConditionLocationItem[];

  @ManyToOne(type => Promotion)
  promotion?: Promotion;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
