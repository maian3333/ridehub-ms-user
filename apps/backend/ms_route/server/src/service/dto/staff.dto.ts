/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Gender } from '../../domain/enumeration/gender';
import { StaffStatus } from '../../domain/enumeration/staff-status';
import { BaseDTO } from './base.dto';

import { DriverDTO } from './driver.dto';
import { AttendantDTO } from './attendant.dto';

/**
 * A StaffDTO object.
 */
export class StaffDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'name field' })
  name: string;

  @ApiProperty({ description: 'age field', required: false })
  age?: number;

  @ApiProperty({ enum: Gender, description: 'gender enum field', required: false })
  gender?: Gender;

  @ApiProperty({ description: 'phoneNumber field', required: false })
  phoneNumber?: string;

  @ApiProperty({ enum: StaffStatus, description: 'status enum field', required: false })
  status?: StaffStatus;

  @IsNotEmpty()
  @ApiProperty({ description: 'createdAt field' })
  createdAt: any;

  @ApiProperty({ description: 'updatedAt field', required: false })
  updatedAt?: any;

  @ApiProperty({ description: 'isDeleted field', required: false })
  isDeleted?: boolean;

  @ApiProperty({ description: 'deletedAt field', required: false })
  deletedAt?: any;

  @ApiProperty({ description: 'deletedBy field', required: false })
  deletedBy?: string;

  @ApiProperty({ type: () => DriverDTO, description: 'driver relationship' })
  driver?: DriverDTO;
  @ApiProperty({ type: () => AttendantDTO, description: 'attendant relationship' })
  attendant?: AttendantDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
