/** Registers accounts with hashed passwords and issues JWTs after login. */
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, Role } from '../user.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    dto: RegisterDto,
  ): Promise<{ id: number; email: string; role: Role }> {
    const existing = await this.users.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('El correo ya está registrado');
    }

    const password = await bcrypt.hash(dto.password, 10);

    const user = this.users.create({
      email: dto.email,
      password,
      role: dto.role ?? Role.TECHNICIAN,
    });

    const saved = await this.users.save(user);

    return {
      id: saved.id,
      email: saved.email,
      role: saved.role,
    };
  }

  async login(
    dto: LoginDto,
  ): Promise<{
    accessToken: string;
    user: { id: number; email: string; role: Role };
  }> {
    const user = await this.users
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: dto.email })
      .getOne();

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
