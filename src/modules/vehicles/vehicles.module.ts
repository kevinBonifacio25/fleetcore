/** Registers the vehicle routes and service. */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Vehicle } from './vehicle.entity';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './service/vehicles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
