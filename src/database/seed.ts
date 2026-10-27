/** Inserts repeatable local development accounts and fleet sample records. */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

import { User, Role } from '../modules/auth/user.entity';
import { Vehicle, VehicleStatus } from '../modules/vehicles/vehicle.entity';
import { Mechanic, MechanicStatus } from '../modules/mechanics/mechanic.entity';
import { Workshop, WorkshopStatus } from '../modules/workshops/workshop.entity';
import {
  Maintenance,
  MaintenanceStatus,
  MaintenanceType,
} from '../modules/maintenances/maintenance.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'fleetcore',
  entities: [User, Vehicle, Mechanic, Workshop, Maintenance],
  synchronize: true,
});

async function seed(): Promise<void> {
  await dataSource.initialize();

  try {
    const users = dataSource.getRepository(User);
    const vehicles = dataSource.getRepository(Vehicle);
    const mechanics = dataSource.getRepository(Mechanic);
    const workshops = dataSource.getRepository(Workshop);
    const maintenances = dataSource.getRepository(Maintenance);

    const userData = [
      { email: 'admin@fleetcore.test', password: 'Admin123!', role: Role.ADMIN },
      { email: 'tecnico1@fleetcore.test', password: 'Tecnico123!', role: Role.TECHNICIAN },
      { email: 'tecnico2@fleetcore.test', password: 'Tecnico123!', role: Role.TECHNICIAN },
    ];

    const savedUsers: User[] = [];

    for (const item of userData) {
      let user = await users.findOne({ where: { email: item.email } });

      if (!user) {
        user = users.create({
          email: item.email,
          password: await bcrypt.hash(item.password, 10),
          role: item.role,
        });
        user = await users.save(user);
      }

      savedUsers.push(user);
    }

    const mechanicData = [
      {
        name: 'Carlos Pérez',
        email: 'mecanico1@fleetcore.test',
        specialty: 'Motor',
        status: MechanicStatus.ACTIVE,
        userId: savedUsers[1].id,
      },
      {
        name: 'Laura Gómez',
        email: 'mecanico2@fleetcore.test',
        specialty: 'Frenos',
        status: MechanicStatus.ACTIVE,
        userId: savedUsers[2].id,
      },
      {
        name: 'Andrés Díaz',
        email: 'mecanico3@fleetcore.test',
        specialty: 'Electricidad',
        status: MechanicStatus.INACTIVE,
        userId: null,
      },
    ];

    const savedMechanics: Mechanic[] = [];

    for (const item of mechanicData) {
      let mechanic = await mechanics.findOne({ where: { email: item.email } });

      if (!mechanic) {
        mechanic = await mechanics.save(mechanics.create(item));
      }

      savedMechanics.push(mechanic);
    }

    const workshopData = [
      { name: 'Taller Central', address: 'Calle 10 #20-30', status: WorkshopStatus.ACTIVE },
      { name: 'Taller Norte', address: 'Carrera 45 #80-20', status: WorkshopStatus.INACTIVE },
    ];

    const savedWorkshops: Workshop[] = [];

    for (const item of workshopData) {
      let workshop = await workshops.findOne({ where: { name: item.name } });

      if (!workshop) {
        workshop = await workshops.save(workshops.create(item));
      }

      savedWorkshops.push(workshop);
    }

    const vehicleData = [
      { plate: 'FLC001', brand: 'Toyota', model: 'Hiace', year: 2022, mileage: 25000, status: VehicleStatus.AVAILABLE },
      { plate: 'FLC002', brand: 'Chevrolet', model: 'NPR', year: 2021, mileage: 40000, status: VehicleStatus.AVAILABLE },
      { plate: 'FLC003', brand: 'Hino', model: '300', year: 2020, mileage: 60000, status: VehicleStatus.IN_MAINTENANCE },
      { plate: 'FLC004', brand: 'Ford', model: 'Transit', year: 2019, mileage: 85000, status: VehicleStatus.INACTIVE },
    ];

    const savedVehicles: Vehicle[] = [];

    for (const item of vehicleData) {
      let vehicle = await vehicles.findOne({ where: { plate: item.plate } });

      if (!vehicle) {
        vehicle = await vehicles.save(vehicles.create(item));
      }

      savedVehicles.push(vehicle);
    }

    const completedExists = await maintenances.findOne({
      where: {
        vehicleId: savedVehicles[0].id,
        status: MaintenanceStatus.COMPLETED,
      },
    });

    if (!completedExists) {
      await maintenances.save(maintenances.create({
        type: MaintenanceType.PREVENTIVE,
        description: 'Cambio de aceite y revisión general',
        mileage: 24000,
        scheduledDate: new Date('2026-09-01T09:00:00.000Z'),
        status: MaintenanceStatus.COMPLETED,
        workDone: 'Cambio de aceite, filtros y revisión de frenos',
        finalCost: '350000.00',
        finishedAt: new Date('2026-09-01T11:00:00.000Z'),
        finalMileage: 24000,
        vehicle: savedVehicles[0],
        vehicleId: savedVehicles[0].id,
        mechanic: savedMechanics[0],
        mechanicId: savedMechanics[0].id,
        workshop: savedWorkshops[0],
        workshopId: savedWorkshops[0].id,
      }));
    }

    const inProgressExists = await maintenances.findOne({
      where: {
        vehicleId: savedVehicles[2].id,
        status: MaintenanceStatus.IN_PROGRESS,
      },
    });

    if (!inProgressExists) {
      await maintenances.save(maintenances.create({
        type: MaintenanceType.CORRECTIVE,
        description: 'Revisión del sistema de transmisión',
        mileage: savedVehicles[2].mileage,
        scheduledDate: new Date('2026-10-27T14:00:00.000Z'),
        status: MaintenanceStatus.IN_PROGRESS,
        workDone: null,
        finalCost: null,
        finishedAt: null,
        finalMileage: null,
        vehicle: savedVehicles[2],
        vehicleId: savedVehicles[2].id,
        mechanic: savedMechanics[1],
        mechanicId: savedMechanics[1].id,
        workshop: savedWorkshops[0],
        workshopId: savedWorkshops[0].id,
      }));
    }

    console.log('Seeder ejecutado correctamente.');
    console.log('Admin: admin@fleetcore.test / Admin123!');
    console.log('Técnico 1: tecnico1@fleetcore.test / Tecnico123!');
    console.log('Técnico 2: tecnico2@fleetcore.test / Tecnico123!');
  } finally {
    await dataSource.destroy();
  }
}

void seed().catch((error: unknown) => {
  console.error('Error ejecutando el seeder:', error);
  process.exitCode = 1;
});
