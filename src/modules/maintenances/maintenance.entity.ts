/** Maps maintenance records and their required vehicle, mechanic, and workshop links. */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vehicle } from '../vehicles/vehicle.entity';
import { Mechanic } from '../mechanics/mechanic.entity';
import { Workshop } from '../workshops/workshop.entity';

export enum MaintenanceType {
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
}

export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('maintenances')
export class Maintenance {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: MaintenanceType })
  type!: MaintenanceType;

  @Column()
  description!: string;

  @Column({ type: 'int' })
  mileage!: number;

  @Column({ type: 'timestamp' })
  scheduledDate!: Date;

  @Column({
    type: 'enum',
    enum: MaintenanceStatus,
    default: MaintenanceStatus.SCHEDULED,
  })
  status!: MaintenanceStatus;

  @Column({ type: 'text', nullable: true })
  workDone!: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  finalCost!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  finishedAt!: Date | null;

  @Column({ type: 'int', nullable: true })
  finalMileage!: number | null;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.maintenances, { nullable: false })
  @JoinColumn({ name: 'vehicleId' })
  vehicle!: Vehicle;

  @Column()
  vehicleId!: number;

  @ManyToOne(() => Mechanic, (mechanic) => mechanic.maintenances, { nullable: false })
  @JoinColumn({ name: 'mechanicId' })
  mechanic!: Mechanic;

  @Column()
  mechanicId!: number;

  @ManyToOne(() => Workshop, (workshop) => workshop.maintenances, { nullable: false })
  @JoinColumn({ name: 'workshopId' })
  workshop!: Workshop;

  @Column()
  workshopId!: number;
}
