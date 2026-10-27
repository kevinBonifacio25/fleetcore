/** Applies maintenance assignment rules and updates related fleet records. */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Maintenance, MaintenanceStatus } from '../maintenance.entity';
import { CreateMaintenanceDto } from '../dto/create-maintenance.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';
import { Vehicle, VehicleStatus } from '../../vehicles/vehicle.entity';
import { Mechanic, MechanicStatus } from '../../mechanics/mechanic.entity';
import { Workshop, WorkshopStatus } from '../../workshops/workshop.entity';
import { AuthUser } from '../../../common/auth.types';
import { Role, User } from '../../auth/user.entity';

@Injectable()
export class MaintenancesService {
  constructor(
    @InjectRepository(Maintenance)
    private readonly maintenances: Repository<Maintenance>,
    @InjectRepository(Vehicle)
    private readonly vehicles: Repository<Vehicle>,
    @InjectRepository(Mechanic)
    private readonly mechanics: Repository<Mechanic>,
    @InjectRepository(Workshop)
    private readonly workshops: Repository<Workshop>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateMaintenanceDto): Promise<Maintenance> {
    const vehicle = await this.vehicles.findOne({
      where: { id: dto.vehicleId },
    });
    if (!vehicle) throw new NotFoundException('Vehículo no encontrado');
    if (vehicle.status === VehicleStatus.INACTIVE) {
      throw new BadRequestException('No se puede asignar un vehículo inactivo');
    }
    if (dto.mileage < vehicle.mileage) {
      throw new BadRequestException(
        'El kilometraje del mantenimiento no puede ser menor al del vehículo',
      );
    }

    const mechanic = await this.mechanics.findOne({
      where: { id: dto.mechanicId },
    });
    if (!mechanic) throw new NotFoundException('Mecánico no encontrado');
    if (mechanic.status !== MechanicStatus.ACTIVE) {
      throw new BadRequestException('No se puede asignar un mecánico inactivo');
    }

    const workshop = await this.workshops.findOne({
      where: { id: dto.workshopId },
    });
    if (!workshop) throw new NotFoundException('Taller no encontrado');
    if (workshop.status !== WorkshopStatus.ACTIVE) {
      throw new BadRequestException('No se puede asignar un taller inactivo');
    }

    const activeStatuses = [
      MaintenanceStatus.SCHEDULED,
      MaintenanceStatus.IN_PROGRESS,
    ];

    const vehicleActive = await this.maintenances.findOne({
      where: activeStatuses.map((status) => ({
        vehicleId: dto.vehicleId,
        status,
      })),
    });
    if (vehicleActive) {
      throw new BadRequestException(
        'El vehículo ya tiene un mantenimiento activo',
      );
    }

    const mechanicActive = await this.maintenances.findOne({
      where: activeStatuses.map((status) => ({
        mechanicId: dto.mechanicId,
        status,
      })),
    });
    if (mechanicActive) {
      throw new BadRequestException(
        'El mecánico ya tiene un mantenimiento activo',
      );
    }

    const maintenance = this.maintenances.create({
      ...dto,
      scheduledDate: new Date(dto.scheduledDate),
      status: MaintenanceStatus.SCHEDULED,
      vehicle,
      mechanic,
      workshop,
      workDone: null,
      finalCost: null,
      finishedAt: null,
      finalMileage: null,
    });

    return this.maintenances.save(maintenance);
  }

  findAll(): Promise<Maintenance[]> {
    return this.maintenances.find({
      relations: { vehicle: true, mechanic: true, workshop: true },
      order: { scheduledDate: 'ASC' },
    });
  }

  async findByVehicle(vehicleId: number): Promise<Maintenance[]> {
    const vehicle = await this.vehicles.findOne({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException('Vehículo no encontrado');

    return this.maintenances.find({
      where: { vehicleId },
      relations: { vehicle: true, mechanic: true, workshop: true },
      order: { scheduledDate: 'DESC' },
    });
  }

  async findMySchedule(user: AuthUser): Promise<Maintenance[]> {
    const mechanic = await this.mechanics.findOne({
      where: { userId: user.id },
    });
    if (!mechanic) {
      throw new NotFoundException('No hay un mecánico vinculado a este usuario');
    }

    return this.maintenances.find({
      where: { mechanicId: mechanic.id },
      relations: { vehicle: true, mechanic: true, workshop: true },
      order: { scheduledDate: 'ASC' },
    });
  }

  async updateStatus(id: number, dto: UpdateStatusDto): Promise<Maintenance> {
    const maintenance = await this.maintenances.findOne({
      where: { id },
      relations: { vehicle: true, mechanic: true, workshop: true },
    });
    if (!maintenance) {
      throw new NotFoundException('Mantenimiento no encontrado');
    }

    if (
      maintenance.status === MaintenanceStatus.COMPLETED ||
      maintenance.status === MaintenanceStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'No se puede modificar un mantenimiento completado o cancelado',
      );
    }

    if (
      dto.status === MaintenanceStatus.COMPLETED &&
      (!dto.workDone ||
        dto.finalCost === undefined ||
        !dto.finishedAt ||
        dto.finalMileage === undefined)
    ) {
      throw new BadRequestException(
        'Para completar se requiere workDone, finalCost, finishedAt y finalMileage',
      );
    }


    return this.dataSource.transaction(async (manager) => {
      const maintenanceRepository = manager.getRepository(Maintenance);
      const vehicleRepository = manager.getRepository(Vehicle);

      if (dto.status === MaintenanceStatus.IN_PROGRESS) {
        maintenance.vehicle.status = VehicleStatus.IN_MAINTENANCE;
        await vehicleRepository.save(maintenance.vehicle);
      }

      if (dto.status === MaintenanceStatus.COMPLETED) {
        if (
          dto.finalMileage !== undefined &&
          dto.finalMileage < maintenance.vehicle.mileage
        ) {
          throw new BadRequestException(
            'El kilometraje final no puede ser menor al kilometraje actual',
          );
        }

        maintenance.vehicle.mileage = dto.finalMileage as number;
        maintenance.vehicle.status = VehicleStatus.AVAILABLE;
        await vehicleRepository.save(maintenance.vehicle);

        maintenance.workDone = dto.workDone as string;
        maintenance.finalCost = String(dto.finalCost);
        maintenance.finishedAt = new Date(dto.finishedAt as string);
        maintenance.finalMileage = dto.finalMileage as number;
      }

      maintenance.status = dto.status;
      return maintenanceRepository.save(maintenance);
    });
  }
}
