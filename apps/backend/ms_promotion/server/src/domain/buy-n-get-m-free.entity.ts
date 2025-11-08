/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Promotion } from './promotion.entity';

/**
 * A BuyNGetMFree.
 */
@Entity('buy_n_get_m_free')
export class BuyNGetMFree extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'integer', name: 'buy_n' })
  buyN: number;

  @Column({ type: 'integer', name: 'get_m' })
  getM: number;

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
