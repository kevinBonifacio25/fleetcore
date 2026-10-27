/** Maps user accounts, roles, and the optional mechanic relationship to PostgreSQL. */
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Mechanic } from '../mechanics/mechanic.entity';

export enum Role {
  ADMIN = 'ADMIN',
  TECHNICIAN = 'TECHNICIAN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.TECHNICIAN,
  })
  role!: Role;

  @OneToOne(() => Mechanic, (mechanic) => mechanic.user)
  mechanic?: Mechanic;
}
