/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { ConditionByDate } from './condition-by-date.entity';

/**
 * A ConditionDateItem.
 */
@Entity('condition_date_item')
export class ConditionDateItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'date', name: 'specific_date', nullable: true })
  specificDate?: any;

  @Column({ type: 'integer', name: 'weekday', nullable: true })
  weekday?: number;

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

  @ManyToOne(type => ConditionByDate)
  condition?: ConditionByDate;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
