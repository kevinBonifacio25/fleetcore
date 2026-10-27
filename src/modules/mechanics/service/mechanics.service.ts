/** Creates and manages mechanics while validating unique and linked account data. */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/user.entity';
import { Mechanic, MechanicStatus } from '../mechanic.entity';
import { CreateMechanicDto, UpdateMechanicDto } from '../dto/mechanic.dto';

@Injectable()
export class MechanicsService {
  constructor(
    @InjectRepository(Mechanic)
    private readonly mechanics: Repository<Mechanic>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async create(dto: CreateMechanicDto): Promise<Mechanic> {
    const existingEmail = await this.mechanics.findOne({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new ConflictException('El correo ya está registrado para un mecánico');
    }

    if (dto.userId !== undefined && dto.userId !== null) {
      const user = await this.users.findOne({ where: { id: dto.userId } });
      if (!user) {
        throw new NotFoundException('Usuario vinculado no encontrado');
      }

      const existingUserLink = await this.mechanics.findOne({
        where: { userId: dto.userId },
      });
      if (existingUserLink) {
        throw new ConflictException('El usuario ya está vinculado a un mecánico');
      }
    }

    return this.mechanics.save(this.mechanics.create(dto));
  }

  findAll(): Promise<Mechanic[]> {
    return this.mechanics.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Mechanic> {
    const mechanic = await this.mechanics.findOne({ where: { id } });

    if (!mechanic) {
      throw new NotFoundException('Mecánico no encontrado');
    }

    return mechanic;
  }

  async update(id: number, dto: UpdateMechanicDto): Promise<Mechanic> {
    const mechanic = await this.findOne(id);
    Object.assign(mechanic, dto);
    return this.mechanics.save(mechanic);
  }

  async setStatus(id: number, status: MechanicStatus): Promise<Mechanic> {
    const mechanic = await this.findOne(id);
    mechanic.status = status;
    return this.mechanics.save(mechanic);
  }
}
