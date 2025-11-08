/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from './base.dto';

import { FileUserDTO } from './file-user.dto';
import { AppUserDTO } from './app-user.dto';

/**
 * A ProfileDTO object.
 */
export class ProfileDTO extends BaseDTO {
  id?: number;

  @ApiProperty({ description: 'fullName field', required: false })
  fullName?: string;

  @ApiProperty({ description: 'birthDate field', required: false })
  birthDate?: any;

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

  @ApiProperty({ type: () => FileUserDTO, description: 'avatar relationship' })
  avatar?: FileUserDTO;
  @ApiProperty({ type: () => AppUserDTO, description: 'user relationship' })
  user?: AppUserDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
