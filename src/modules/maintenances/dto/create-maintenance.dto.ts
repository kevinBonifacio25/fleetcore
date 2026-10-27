/** Validates the vehicle, mechanic, workshop, and schedule for a new maintenance. */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { MaintenanceType } from '../maintenance.entity';

export class CreateMaintenanceDto {
  @ApiProperty({ enum: MaintenanceType })
  @IsEnum(MaintenanceType)
  type!: MaintenanceType;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  description!: string;

  @ApiProperty({ minimum: 0 })
  @IsInt()
  @Min(0)
  mileage!: number;

  @ApiProperty({ example: '2026-11-01T09:00:00.000Z' })
  @IsDateString()
  scheduledDate!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  vehicleId!: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  mechanicId!: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  workshopId!: number;
}
