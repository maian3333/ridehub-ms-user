/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from './base.dto';

import { ProfileDTO } from './profile.dto';

/**
 * A FileUserDTO object.
 */
export class FileUserDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'bucket field' })
  bucket: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'objectKey field' })
  objectKey: string;

  @ApiProperty({ description: 'contentType field', required: false })
  contentType?: string;

  @ApiProperty({ description: 'size field', required: false })
  size?: number;

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
