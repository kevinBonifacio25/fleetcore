/** Validates required vehicle details and their default status. */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString, Min, MinLength } from 'class-validator';
import { VehicleStatus } from '../vehicle.entity';

export class CreateVehicleDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  plate!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  brand!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  model!: string;

  @ApiProperty()
  @IsInt()
  @Min(1900)
  year!: number;

  @ApiProperty({ minimum: 0 })
  @IsInt()
  @Min(0)
  mileage!: number;

  @ApiProperty({ enum: VehicleStatus, required: false })
  @IsEnum(VehicleStatus)
  status: VehicleStatus = VehicleStatus.AVAILABLE;
}
