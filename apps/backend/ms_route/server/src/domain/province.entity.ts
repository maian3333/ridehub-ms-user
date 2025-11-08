/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { District } from './district.entity';

/**
 * A Province.
 */
@Entity('province')
export class Province extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'province_code', unique: true })
  provinceCode: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'name_en', nullable: true })
  nameEn?: string;

  @Column({ name: 'full_name', nullable: true })
  fullName?: string;

  @Column({ name: 'full_name_en', nullable: true })
  fullNameEn?: string;

  @Column({ name: 'code_name', nullable: true })
  codeName?: string;

  @Column({ type: 'integer', name: 'administrative_unit_id', nullable: true })
  administrativeUnitId?: number;

  @Column({ type: 'integer', name: 'administrative_region_id', nullable: true })
  administrativeRegionId?: number;

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

  @OneToMany(type => District, other => other.province)
  districts?: District[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
