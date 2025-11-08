/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { VehicleType } from '../../domain/enumeration/vehicle-type';
import { VehicleStatus } from '../../domain/enumeration/vehicle-status';
import { BaseDTO } from './base.dto';

import { SeatMapDTO } from './seat-map.dto';
import { FileRouteDTO } from './file-route.dto';

/**
 * A VehicleDTO object.
 */
export class VehicleDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @ApiProperty({ enum: VehicleType, description: 'type enum field' })
  type: VehicleType;

  @ApiProperty({ description: 'typeFactor field', required: false })
  typeFactor?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'plateNumber field' })
  plateNumber: string;

  @ApiProperty({ description: 'brand field', required: false })
  brand?: string;

  @ApiProperty({ description: 'description field', required: false })
  description?: string;

  @IsNotEmpty()
  @ApiProperty({ enum: VehicleStatus, description: 'status enum field' })
  status: VehicleStatus;

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

  @ApiProperty({ type: () => SeatMapDTO, description: 'seatMap relationship' })
  seatMap?: SeatMapDTO;
  @ApiProperty({ type: () => FileRouteDTO, description: 'vehicleImg relationship' })
  vehicleImg?: FileRouteDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
