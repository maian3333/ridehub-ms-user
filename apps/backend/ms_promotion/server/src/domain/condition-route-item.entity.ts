/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { ConditionByRoute } from './condition-by-route.entity';

/**
 * A ConditionRouteItem.
 */
@Entity('condition_route_item')
export class ConditionRouteItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'long', name: 'route_id' })
  routeId: number;

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

  @ManyToOne(type => ConditionByRoute)
  condition?: ConditionByRoute;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
