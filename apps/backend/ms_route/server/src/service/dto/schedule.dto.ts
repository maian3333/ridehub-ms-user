/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from './base.dto';

import { ScheduleTimeSlotDTO } from './schedule-time-slot.dto';
import { ScheduleOccasionDTO } from './schedule-occasion.dto';
import { RouteDTO } from './route.dto';

/**
 * A ScheduleDTO object.
 */
export class ScheduleDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'scheduleCode field' })
  scheduleCode: string;

  @ApiProperty({ description: 'startDate field', required: false })
  startDate?: any;

  @ApiProperty({ description: 'endDate field', required: false })
  endDate?: any;

  @ApiProperty({ description: 'daysOfWeek field', required: false })
  daysOfWeek?: string;

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

  @ApiProperty({ type: () => ScheduleTimeSlotDTO, isArray: true, description: 'timeSlots relationship' })
  timeSlots?: ScheduleTimeSlotDTO[];
  @ApiProperty({ type: () => ScheduleOccasionDTO, description: 'occasionRule relationship' })
  occasionRule?: ScheduleOccasionDTO;
  @ApiProperty({ type: () => RouteDTO, description: 'route relationship' })
  route?: RouteDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
