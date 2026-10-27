/** Maps workshop locations, availability, and maintenance history. */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Maintenance } from '../maintenances/maintenance.entity';

export enum WorkshopStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('workshops')
export class Workshop {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  address!: string;

  @Column({
    type: 'enum',
    enum: WorkshopStatus,
    default: WorkshopStatus.ACTIVE,
  })
  status!: WorkshopStatus;

  @OneToMany(() => Maintenance, (maintenance) => maintenance.workshop)
  maintenances!: Maintenance[];
}
