/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { ProfileDTO } from './profile.dto';

/**
 * A AppUserDTO object.
 */
export class AppUserDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'keycloakId field' })
  keycloakId: string;

  @IsNotEmpty()
  @Matches('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')
  @ApiProperty({ description: 'email field' })
  email: string;

  @ApiProperty({ description: 'phoneNumber field', required: false })
  phoneNumber?: string;

  @ApiProperty({ description: 'firstName field', required: false })
  firstName?: string;

  @ApiProperty({ description: 'lastName field', required: false })
  lastName?: string;

  @ApiProperty({ description: 'dateOfBirth field', required: false })
  dateOfBirth?: any;

  @ApiProperty({ description: 'isVerified field', required: false })
  isVerified?: boolean;

  @IsNotEmpty()
  @ApiProperty({ description: 'isActive field' })
  isActive: boolean;

  @ApiProperty({ description: 'lastLoginAt field', required: false })
  lastLoginAt?: any;

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

  @ApiProperty({ type: () => ProfileDTO, description: 'profile relationship' })
  profile?: ProfileDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
