/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { BaseDTO } from './base.dto';

import { ScheduleDTO } from './schedule.dto';
import { StationDTO } from './station.dto';

/**
 * A RouteDTO object.
 */
export class RouteDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @MaxLength(40)
  @ApiProperty({ description: 'routeCode field' })
  routeCode: string;

  @ApiProperty({ description: 'distanceKm field', required: false })
  distanceKm?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'baseFare field' })
  baseFare: number;

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
  @ApiProperty({ type: () => StationDTO, description: 'origin relationship' })
  origin?: StationDTO;
  @ApiProperty({ type: () => StationDTO, description: 'destination relationship' })
  destination?: StationDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
