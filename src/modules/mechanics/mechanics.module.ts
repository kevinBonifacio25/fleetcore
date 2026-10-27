/** Registers the mechanic routes and repositories used by the mechanic service. */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { Mechanic } from './mechanic.entity';
import { MechanicsController } from './mechanics.controller';
import { MechanicsService } from './service/mechanics.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mechanic, User])],
  controllers: [MechanicsController],
  providers: [MechanicsService],
  exports: [MechanicsService],
})
export class MechanicsModule {}
