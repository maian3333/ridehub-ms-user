/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from './base.dto';

import { ScheduleDTO } from './schedule.dto';

/**
 * A ScheduleTimeSlotDTO object.
 */
export class ScheduleTimeSlotDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'slotCode field' })
  slotCode: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'departureTime field' })
  departureTime: any;

  @IsNotEmpty()
  @ApiProperty({ description: 'arrivalTime field' })
  arrivalTime: any;

  @ApiProperty({ description: 'bufferMinutes field', required: false })
  bufferMinutes?: number;

  @ApiProperty({ description: 'sequence field', required: false })
  sequence?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'active field' })
  active: boolean;

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

  @ApiProperty({ type: () => ScheduleDTO, description: 'schedule relationship' })
  schedule?: ScheduleDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
