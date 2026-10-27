/** Exposes mechanic CRUD and activation routes with administrator restrictions. */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators';
import { Role } from '../auth/user.entity';
import { MechanicsService } from './service/mechanics.service';
import { CreateMechanicDto, UpdateMechanicDto } from './dto/mechanic.dto';
import { MechanicStatus } from './mechanic.entity';

@ApiTags('Mechanics')
@ApiBearerAuth()
@Controller('mechanics')
export class MechanicsController {
  constructor(private readonly service: MechanicsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Crear mecánico' })
  create(@Body() dto: CreateMechanicDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMechanicDto,
  ) {
    return this.service.update(id, dto);
  }

  @Patch(':id/activate')
  @Roles(Role.ADMIN)
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.service.setStatus(id, MechanicStatus.ACTIVE);
  }

  @Patch(':id/deactivate')
  @Roles(Role.ADMIN)
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.service.setStatus(id, MechanicStatus.INACTIVE);
  }
}
