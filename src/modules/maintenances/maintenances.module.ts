/** Registers maintenance controllers and the repositories they use. */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Maintenance } from './maintenance.entity';
import { MaintenancesController } from './maintenances.controller';
import { MaintenancesService } from './service/maintenances.service';
import { Vehicle } from '../vehicles/vehicle.entity';
import { Mechanic } from '../mechanics/mechanic.entity';
import { Workshop } from '../workshops/workshop.entity';
import { User } from '../auth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Maintenance,
      Vehicle,
      Mechanic,
      Workshop,
      User,
    ]),
  ],
  controllers: [MaintenancesController],
  providers: [MaintenancesService],
})
export class MaintenancesModule {}
