/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from './base.dto';

import { RouteDTO } from './route.dto';
import { VehicleDTO } from './vehicle.dto';
import { ScheduleTimeSlotDTO } from './schedule-time-slot.dto';
import { DriverDTO } from './driver.dto';
import { AttendantDTO } from './attendant.dto';

/**
 * A TripDTO object.
 */
export class TripDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'tripCode field' })
  tripCode: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'departureTime field' })
  departureTime: any;

  @IsNotEmpty()
  @ApiProperty({ description: 'arrivalTime field' })
  arrivalTime: any;

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

  @ApiProperty({ type: () => RouteDTO, description: 'route relationship' })
  route?: RouteDTO;
  @ApiProperty({ type: () => VehicleDTO, description: 'vehicle relationship' })
  vehicle?: VehicleDTO;
  @ApiProperty({ type: () => ScheduleTimeSlotDTO, description: 'slot relationship' })
  slot?: ScheduleTimeSlotDTO;
  @ApiProperty({ type: () => DriverDTO, description: 'driver relationship' })
  driver?: DriverDTO;
  @ApiProperty({ type: () => AttendantDTO, description: 'attendant relationship' })
  attendant?: AttendantDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
