/** Exposes workshop lookup, creation, updates, and status routes. */
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
import { WorkshopsService } from './service/workshops.service';
import { CreateWorkshopDto, UpdateWorkshopDto } from './dto/workshop.dto';
import { WorkshopStatus } from './workshop.entity';

@ApiTags('Workshops')
@ApiBearerAuth()
@Controller('workshops')
export class WorkshopsController {
  constructor(private readonly service: WorkshopsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Crear taller' })
  create(@Body() dto: CreateWorkshopDto) {
    return this.service.create(dto);
  }

  @Get()
  findActive() {
    return this.service.findActive();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkshopDto,
  ) {
    return this.service.update(id, dto);
  }

  @Patch(':id/activate')
  @Roles(Role.ADMIN)
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.service.setStatus(id, WorkshopStatus.ACTIVE);
  }

  @Patch(':id/deactivate')
  @Roles(Role.ADMIN)
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.service.setStatus(id, WorkshopStatus.INACTIVE);
  }
}
