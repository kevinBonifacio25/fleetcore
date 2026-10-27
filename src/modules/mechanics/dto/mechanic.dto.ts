/** Validates mechanic fields accepted during creation and partial updates. */
import { PartialType, ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { MechanicStatus } from '../mechanic.entity';

export class CreateMechanicDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  specialty!: string;

  @ApiProperty({ enum: MechanicStatus, required: false })
  @IsOptional()
  @IsEnum(MechanicStatus)
  status?: MechanicStatus;

  @ApiHideProperty()
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  userId?: number | null;
}

export class UpdateMechanicDto extends PartialType(CreateMechanicDto) {}
