/** Validates status changes and the completion details for a maintenance. */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { MaintenanceStatus } from '../maintenance.entity';

export class UpdateStatusDto {
  @ApiProperty({ enum: MaintenanceStatus })
  @IsEnum(MaintenanceStatus)
  status!: MaintenanceStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  workDone?: string;

  @ApiProperty({ required: false, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  finalCost?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  finishedAt?: string;

  @ApiProperty({ required: false, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  finalMileage?: number;
}
