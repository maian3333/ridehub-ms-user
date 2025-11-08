/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Ticket } from './ticket.entity';

/**
 * A FileBooking.
 */
@Entity('file_booking')
export class FileBooking extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'bucket' })
  bucket: string;

  @Column({ name: 'object_key' })
  objectKey: string;

  @Column({ name: 'content_type', nullable: true })
  contentType?: string;

  @Column({ type: 'long', name: 'size', nullable: true })
  size?: number;

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

  @OneToOne(type => Ticket)
  ticket?: Ticket;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
