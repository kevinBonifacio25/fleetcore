/** Validates workshop details and defines fields allowed in workshop updates. */
import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MinLength } from 'class-validator';
import { WorkshopStatus } from '../workshop.entity';

export class CreateWorkshopDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  address!: string;

  @ApiProperty({ enum: WorkshopStatus, required: false })
  @IsEnum(WorkshopStatus)
  status: WorkshopStatus = WorkshopStatus.ACTIVE;
}

export class UpdateWorkshopDto extends PartialType(CreateWorkshopDto) {}
