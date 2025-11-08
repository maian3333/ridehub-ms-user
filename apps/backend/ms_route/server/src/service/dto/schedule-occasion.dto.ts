/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { OccasionType } from '../../domain/enumeration/occasion-type';
import { BaseDTO } from './base.dto';

import { ScheduleDTO } from './schedule.dto';

/**
 * A ScheduleOccasionDTO object.
 */
export class ScheduleOccasionDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @ApiProperty({ enum: OccasionType, description: 'occasion enum field' })
  occasion: OccasionType;

  @IsNotEmpty()
  @ApiProperty({ description: 'occasionFactor field' })
  occasionFactor: number;

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

  @ApiProperty({ type: () => ScheduleDTO, isArray: true, description: 'schedules relationship' })
  schedules?: ScheduleDTO[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
