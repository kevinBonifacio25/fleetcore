/** Registers the API modules, database connection, and application-wide configuration. */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './modules/auth/auth.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { MechanicsModule } from './modules/mechanics/mechanics.module';
import { WorkshopsModule } from './modules/workshops/workshops.module';
import { MaintenancesModule } from './modules/maintenances/maintenances.module';
import { IntegrationModule } from './modules/integration/integration.module';

import { User } from './modules/auth/user.entity';
import { Vehicle } from './modules/vehicles/vehicle.entity';
import { Mechanic } from './modules/mechanics/mechanic.entity';
import { Workshop } from './modules/workshops/workshop.entity';
import { Maintenance } from './modules/maintenances/maintenance.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_NAME', 'fleetcore'),
        entities: [User, Vehicle, Mechanic, Workshop, Maintenance],
        synchronize: true,
      }),
    }),

    AuthModule,
    VehiclesModule,
    MechanicsModule,
    WorkshopsModule,
    MaintenancesModule,
    IntegrationModule,
  ],
})
export class AppModule {}
