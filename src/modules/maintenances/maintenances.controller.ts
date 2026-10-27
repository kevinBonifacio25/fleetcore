/** Exposes maintenance creation, queries, schedules, and status updates. */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser, Roles } from '../../common/decorators';
import { AuthUser } from '../../common/auth.types';
import { Role } from '../auth/user.entity';
import { MaintenancesService } from './service/maintenances.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@ApiTags('Maintenances')
@ApiBearerAuth()
@Controller('maintenances')
export class MaintenancesController {
  constructor(private readonly service: MaintenancesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear mantenimiento' })
  create(@Body() dto: CreateMaintenanceDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Consultar todos los mantenimientos' })
  findAll() {
    return this.service.findAll();
  }

  @Get('my-schedule')
  @Roles(Role.TECHNICIAN)
  @ApiOperation({ summary: 'Consultar agenda del técnico autenticado' })
  mySchedule(@CurrentUser() user: AuthUser) {
    return this.service.findMySchedule(user);
  }

  @Get('vehicle/:vehicleId')
  findByVehicle(@Param('vehicleId', ParseIntPipe) vehicleId: number) {
    return this.service.findByVehicle(vehicleId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.service.updateStatus(id, dto);
  }
}
