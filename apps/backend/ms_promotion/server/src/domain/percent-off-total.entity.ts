/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Promotion } from './promotion.entity';

/**
 * A PercentOffTotal.
 */
@Entity('percent_off_total')
export class PercentOffTotal extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'integer', name: 'percent' })
  percent: number;

  @Column({ type: 'decimal', name: 'max_off', precision: 10, scale: 2, nullable: true })
  maxOff?: number;

  @Column({ type: 'decimal', name: 'min_price', precision: 10, scale: 2, nullable: true })
  minPrice?: number;

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

  @ManyToOne(type => Promotion)
  promotion?: Promotion;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
