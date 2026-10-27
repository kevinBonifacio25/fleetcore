/** Maps mechanic profiles, their optional user account, and maintenance history. */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Maintenance } from '../maintenances/maintenance.entity';

export enum MechanicStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('mechanics')
export class Mechanic {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  specialty!: string;

  @Column({
    type: 'enum',
    enum: MechanicStatus,
    default: MechanicStatus.ACTIVE,
  })
  status!: MechanicStatus;

  @Column({ nullable: true, unique: true })
  userId!: number | null;

  @OneToOne(() => User, (user) => user.mechanic, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @OneToMany(() => Maintenance, (maintenance) => maintenance.mechanic)
  maintenances!: Maintenance[];
}
