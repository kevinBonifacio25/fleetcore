/** Maps fleet vehicles, their status, and their maintenance history. */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Maintenance } from '../maintenances/maintenance.entity';

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  IN_MAINTENANCE = 'IN_MAINTENANCE',
  INACTIVE = 'INACTIVE',
}

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  plate!: string;

  @Column()
  brand!: string;

  @Column()
  model!: string;

  @Column({ type: 'int' })
  year!: number;

  @Column({ type: 'int', default: 0 })
  mileage!: number;

  @Column({
    type: 'enum',
    enum: VehicleStatus,
    default: VehicleStatus.AVAILABLE,
  })
  status!: VehicleStatus;

  @OneToMany(() => Maintenance, (maintenance) => maintenance.vehicle)
  maintenances!: Maintenance[];
}
