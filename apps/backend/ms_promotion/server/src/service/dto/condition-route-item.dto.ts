/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from './base.dto';

import { ConditionByRouteDTO } from './condition-by-route.dto';

/**
 * A ConditionRouteItemDTO object.
 */
export class ConditionRouteItemDTO extends BaseDTO {
  id?: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'routeId field' })
  routeId: number;

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

  @ApiProperty({ type: () => ConditionByRouteDTO, description: 'condition relationship' })
  condition?: ConditionByRouteDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
