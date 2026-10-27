/** Handles vehicle persistence, lookup, updates, and deactivation. */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Vehicle, VehicleStatus } from '../vehicle.entity';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicles: Repository<Vehicle>,
  ) {}

  create(dto: CreateVehicleDto): Promise<Vehicle> {
    return this.vehicles.save(this.vehicles.create(dto));
  }

  findAll(): Promise<Vehicle[]> {
    return this.vehicles.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicles.findOne({ where: { id } });

    if (!vehicle) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    return vehicle;
  }

  async findByPlate(plate: string): Promise<Vehicle> {
    const vehicle = await this.vehicles.findOne({ where: { plate } });

    if (!vehicle) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    return vehicle;
  }

  async update(id: number, dto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.findOne(id);
    Object.assign(vehicle, dto);
    return this.vehicles.save(vehicle);
  }

  async deactivate(id: number): Promise<Vehicle> {
    const vehicle = await this.findOne(id);
    vehicle.status = VehicleStatus.INACTIVE;
    return this.vehicles.save(vehicle);
  }
}
