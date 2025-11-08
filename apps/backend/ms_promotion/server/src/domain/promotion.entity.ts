/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { FilePromotion } from './file-promotion.entity';
import { BuyNGetMFree } from './buy-n-get-m-free.entity';
import { PercentOffTotal } from './percent-off-total.entity';
import { ConditionByRoute } from './condition-by-route.entity';
import { ConditionByDate } from './condition-by-date.entity';
import { ConditionByLocation } from './condition-by-location.entity';

/**
 * A Promotion.
 */
@Entity('promotion')
export class Promotion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'code', unique: true })
  code: string;

  @Column({ name: 'description', nullable: true })
  description?: string;

  @Column({ type: 'date', name: 'start_date', nullable: true })
  startDate?: any;

  @Column({ type: 'date', name: 'end_date', nullable: true })
  endDate?: any;

  @Column({ type: 'integer', name: 'usage_limit', nullable: true })
  usageLimit?: number;

  @Column({ type: 'integer', name: 'used_count', nullable: true })
  usedCount?: number;

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

  @OneToMany(type => FilePromotion, other => other.promotion)
  files?: FilePromotion[];

  @OneToMany(type => BuyNGetMFree, other => other.promotion)
  buyNGetMS?: BuyNGetMFree[];

  @OneToMany(type => PercentOffTotal, other => other.promotion)
  percentOffs?: PercentOffTotal[];

  @OneToMany(type => ConditionByRoute, other => other.promotion)
  conditionsRS?: ConditionByRoute[];

  @OneToMany(type => ConditionByDate, other => other.promotion)
  conditionsDS?: ConditionByDate[];

  @OneToMany(type => ConditionByLocation, other => other.promotion)
  conditionsLocs?: ConditionByLocation[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
