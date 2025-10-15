import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const mockUser = {
  userId: '1',
  firstname: 'John',
  lastname: 'Doe',
  username: 'johndoe',
  email : 'email@email.com',
  phone_number: '1234567890',
  passwordHash: 'hashedpassword',
  roles: ['user'],
};

const mockRepository = () => ({
  create: jest.fn().mockReturnValue(mockUser),
  save: jest.fn().mockResolvedValue(mockUser),
  find: jest.fn().mockResolvedValue([mockUser]),
  findOneBy: jest.fn(),
  remove: jest.fn().mockResolvedValue(undefined),
});

jest.mock('src/utils/hashing', () => ({
  hashing: jest.fn().mockResolvedValue('hashedpassword'),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      const dto: CreateUserDto = {
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        phone_number: '1234567890',
        password: 'password',
        role: ['user'],
        email: '',
        isVerified: false,
        mediaId: 0
      };
      await service.create(dto);
      expect(repo.create).toHaveBeenCalledWith({
        ...dto,
        passwordHash: 'hashedpassword',
        roles: dto.role,
      });
      expect(repo.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      repo.findOneBy = jest.fn().mockResolvedValue(mockUser);
      const result = await service.findOne('1');
      expect(result).toEqual(mockUser);
      expect(repo.findOneBy).toHaveBeenCalledWith({ userId: '1' });
    });

    it('should throw NotFoundException if user not found', async () => {
      repo.findOneBy = jest.fn().mockResolvedValue(null);
      await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and save a user', async () => {
      repo.findOneBy = jest.fn().mockResolvedValue({ ...mockUser });
      const dto: UpdateUserDto = {
        firstname: 'Jane',
        lastname: 'Smith',
        username: 'janesmith',
        phone_number: '0987654321',
      };
      await service.update('1', dto);
      expect(repo.save).toHaveBeenCalledWith({
        ...mockUser,
        firstname: dto.firstname,
        lastname: dto.lastname,
        username: dto.username,
        phone_number: dto.phone_number,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      repo.findOneBy = jest.fn().mockResolvedValue(null);
      await expect(service.update('2', {} as UpdateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      repo.findOneBy = jest.fn().mockResolvedValue(mockUser);
      await service.remove('1');
      expect(repo.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      repo.findOneBy = jest.fn().mockResolvedValue(null);
      await expect(service.remove('2')).rejects.toThrow(NotFoundException);
    });
  });
});