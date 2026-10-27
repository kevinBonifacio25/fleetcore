/** Handles workshop persistence, queries, updates, and status changes. */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workshop, WorkshopStatus } from '../workshop.entity';
import { CreateWorkshopDto, UpdateWorkshopDto } from '../dto/workshop.dto';

@Injectable()
export class WorkshopsService {
  constructor(
    @InjectRepository(Workshop)
    private readonly workshops: Repository<Workshop>,
  ) {}

  create(dto: CreateWorkshopDto): Promise<Workshop> {
    return this.workshops.save(this.workshops.create(dto));
  }

  findAll(): Promise<Workshop[]> {
    return this.workshops.find({ order: { id: 'ASC' } });
  }

  findActive(): Promise<Workshop[]> {
    return this.workshops.find({
      where: { status: WorkshopStatus.ACTIVE },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Workshop> {
    const workshop = await this.workshops.findOne({ where: { id } });

    if (!workshop) {
      throw new NotFoundException('Taller no encontrado');
    }

    return workshop;
  }

  async update(id: number, dto: UpdateWorkshopDto): Promise<Workshop> {
    const workshop = await this.findOne(id);
    Object.assign(workshop, dto);
    return this.workshops.save(workshop);
  }

  async setStatus(id: number, status: WorkshopStatus): Promise<Workshop> {
    const workshop = await this.findOne(id);
    workshop.status = status;
    return this.workshops.save(workshop);
  }
}
