/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from './base.dto';

import { StaffDTO } from './staff.dto';

/**
 * A DriverDTO object.
 */
export class DriverDTO extends BaseDTO {
  id?: number;

  @ApiProperty({ description: 'licenseClass field', required: false })
  licenseClass?: string;

  @ApiProperty({ description: 'yearsExperience field', required: false })
  yearsExperience?: number;

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

  @ApiProperty({ type: () => StaffDTO, description: 'staff relationship' })
  staff?: StaffDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
