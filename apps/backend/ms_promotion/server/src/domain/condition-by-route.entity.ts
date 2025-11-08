/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { ConditionRouteItem } from './condition-route-item.entity';
import { Promotion } from './promotion.entity';

/**
 * A ConditionByRoute.
 */
@Entity('condition_by_route')
export class ConditionByRoute extends BaseEntity {
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

  @OneToMany(type => ConditionRouteItem, other => other.condition)
  items?: ConditionRouteItem[];

  @ManyToOne(type => Promotion)
  promotion?: Promotion;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
