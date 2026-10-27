/** Verifies mechanic creation rejects invalid links and accepts valid input. */
import { ConflictException, NotFoundException } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from '../../auth/user.entity';
import { CreateMechanicDto } from '../dto/mechanic.dto';
import { Mechanic } from '../mechanic.entity';
import { MechanicsService } from './mechanics.service';

describe('MechanicsService.create', () => {
  let mechanics: {
    create: jest.Mock<Mechanic, [CreateMechanicDto]>;
    findOne: jest.Mock<Promise<Mechanic | null>, [FindOneOptions<Mechanic>]>;
    save: jest.Mock<Promise<Mechanic>, [Mechanic]>;
  };
  let users: {
    findOne: jest.Mock<Promise<User | null>, [FindOneOptions<User>]>;
  };
  let service: MechanicsService;

  const dto: CreateMechanicDto = {
    name: 'Alex Mechanic',
    email: 'alex@fleetcore.test',
    specialty: 'Engine',
    userId: 7,
  };

  beforeEach(() => {
    mechanics = {
      create: jest.fn((data: CreateMechanicDto) =>
        Object.assign(new Mechanic(), data),
      ),
      findOne: jest.fn<Promise<Mechanic | null>, [FindOneOptions<Mechanic>]>(),
      save: jest.fn<Promise<Mechanic>, [Mechanic]>(),
    };
    users = {
      findOne: jest.fn<Promise<User | null>, [FindOneOptions<User>]>(),
    };
    service = new MechanicsService(
      mechanics as unknown as Repository<Mechanic>,
      users as unknown as Repository<User>,
    );
  });

  it('rejects an email already used by another mechanic', async () => {
    mechanics.findOne.mockResolvedValueOnce(new Mechanic());

    await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);
    expect(users.findOne).not.toHaveBeenCalled();
    expect(mechanics.save).not.toHaveBeenCalled();
  });

  it('rejects a user id that does not exist', async () => {
    mechanics.findOne.mockResolvedValueOnce(null);
    users.findOne.mockResolvedValueOnce(null);

    await expect(service.create(dto)).rejects.toBeInstanceOf(NotFoundException);
    expect(mechanics.save).not.toHaveBeenCalled();
  });

  it('rejects a user already linked to a mechanic', async () => {
    mechanics.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(new Mechanic());
    users.findOne.mockResolvedValueOnce(new User());

    await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);
    expect(mechanics.save).not.toHaveBeenCalled();
  });

  it('creates a mechanic when its email and optional user link are available', async () => {
    mechanics.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    users.findOne.mockResolvedValueOnce(new User());
    mechanics.save.mockImplementation(async (mechanic) => mechanic);

    const result = await service.create(dto);

    expect(result).toMatchObject(dto);
    expect(mechanics.save).toHaveBeenCalledTimes(1);
  });

  it('creates a mechanic with a null user link without looking up a user', async () => {
    mechanics.findOne.mockResolvedValueOnce(null);
    mechanics.save.mockImplementation(async (mechanic) => mechanic);

    const result = await service.create({ ...dto, userId: null });

    expect(result.userId).toBeNull();
    expect(users.findOne).not.toHaveBeenCalled();
  });
});
