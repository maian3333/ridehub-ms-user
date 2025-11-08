/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Schedule } from './schedule.entity';
import { Station } from './station.entity';

/**
 * A Route.
 */
@Entity('route')
export class Route extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'route_code', length: 40, unique: true })
  routeCode: string;

  @Column({ type: 'decimal', name: 'distance_km', precision: 10, scale: 2, nullable: true })
  distanceKm?: number;

  @Column({ type: 'decimal', name: 'base_fare', precision: 10, scale: 2 })
  baseFare: number;

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

  @OneToMany(type => Schedule, other => other.route)
  schedules?: Schedule[];

  @ManyToOne(type => Station)
  origin?: Station;

  @ManyToOne(type => Station)
  destination?: Station;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
